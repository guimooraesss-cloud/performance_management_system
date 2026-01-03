import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

// Procedimento protegido apenas para líderes
const leaderProcedure = protectedProcedure.use(({ ctx, next }: any) => {
  if (ctx.user.role !== "leader" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas líderes podem acessar" });
  }
  return next({ ctx });
});
import { getDb } from "./db";
import {
  evaluations,
  evaluationScores,
  evaluationWeights,
  feedbackRecords,
  pdiRecords,
  evaluationLocks,
  auditLogs,
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const persistenceRouter = router({
  // Salvar avaliação em rascunho
  saveDraftEvaluation: leaderProcedure
    .input(
      z.object({
        employeeId: z.number(),
        evaluationPeriod: z.string(),
        employeeName: z.string(),
        employeeCode: z.string(),
        position: z.string(),
        department: z.string(),
        weights: z.array(
          z.object({
            competencyId: z.number(),
            weight: z.number().min(0).max(100),
          })
        ),
        scores: z.array(
          z.object({
            competencyId: z.number(),
            score: z.number().min(1).max(5),
            comments: z.string().optional(),
          })
        ),
        pdi: z.string().optional(),
        feedbacks: z.array(
          z.object({
            type: z.enum(["strengths", "improvements", "development-areas", "general"]),
            content: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }: any) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Criar ou atualizar avaliação
        const existingEval = await db
          .select()
          .from(evaluations)
          .where(
            and(
              eq(evaluations.employeeId, input.employeeId),
              eq(evaluations.evaluationPeriod, input.evaluationPeriod)
            )
          )
          .limit(1);

        let evaluationId: number;

        if (existingEval.length > 0) {
          evaluationId = existingEval[0].id;
          // Atualizar avaliação existente
          await db
            .update(evaluations)
            .set({
              status: "draft",
              updatedAt: new Date(),
            })
            .where(eq(evaluations.id, evaluationId));
        } else {
          // Criar nova avaliação
          const result = await db.insert(evaluations).values({
            employeeId: input.employeeId,
            leaderId: ctx.user.id,
            evaluationPeriod: input.evaluationPeriod,
            status: "draft",
            employeeName: input.employeeName,
            employeeCode: input.employeeCode,
            employeePosition: input.position,
            employeeDepartment: input.department,
          });
          evaluationId = result[0].insertId;
        }

        // Limpar pesos e scores anteriores
        await db.delete(evaluationWeights).where(eq(evaluationWeights.evaluationId, evaluationId));
        await db.delete(evaluationScores).where(eq(evaluationScores.evaluationId, evaluationId));
        await db.delete(feedbackRecords).where(eq(feedbackRecords.evaluationId, evaluationId));

        // Salvar pesos
        for (const weight of input.weights) {
          await db.insert(evaluationWeights).values({
            evaluationId,
            competencyId: weight.competencyId,
            weight: weight.weight,
            remainingCredit: 100 - weight.weight,
          });
        }

        // Salvar scores
        for (const score of input.scores) {
          const weight = input.weights.find((w: any) => w.competencyId === score.competencyId);
          const weightedScore = weight ? (score.score * weight.weight) / 100 : 0;

          await db.insert(evaluationScores).values({
            evaluationId,
            competencyId: score.competencyId,
            score: score.score.toString(),
            weight: weight?.weight || 0,
            weightedScore: weightedScore.toString(),
            comments: score.comments,
          });
        }

        // Salvar feedback
        for (const feedback of input.feedbacks) {
          await db.insert(feedbackRecords).values({
            evaluationId,
            employeeId: input.employeeId,
            feedbackType: feedback.type,
            content: feedback.content,
          });
        }

        // Salvar PDI se fornecido
        if (input.pdi) {
          await db.insert(pdiRecords).values({
            evaluationId,
            employeeId: input.employeeId,
            developmentArea: "Geral",
            actions: input.pdi,
            timeline: "6 meses",
            status: "planned",
          });
        }

        // Log de auditoria
        await db.insert(auditLogs).values({
          userId: ctx.user.id,
          action: "save_draft_evaluation",
          entityType: "evaluation",
          entityId: evaluationId,
          newValues: {
            employeeId: input.employeeId,
            status: "draft",
            weightsCount: input.weights.length,
            scoresCount: input.scores.length,
          },
          changes: "Avaliação salva em rascunho",
          ipAddress: ctx.req.ip || "unknown",
        });

        return {
          success: true,
          evaluationId,
          message: "Avaliação salva em rascunho com sucesso",
        };
      } catch (error) {
        console.error("Erro ao salvar avaliação:", error);
        throw new Error("Falha ao salvar avaliação");
      }
    }),

  // Carregar avaliação em rascunho
  loadDraftEvaluation: leaderProcedure
    .input(
      z.object({
        employeeId: z.number(),
        evaluationPeriod: z.string(),
      })
    )
    .query(async ({ input }: { input: { employeeId: number; evaluationPeriod: string } }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const evaluation = await db
          .select()
          .from(evaluations)
          .where(
            and(
              eq(evaluations.employeeId, input.employeeId),
              eq(evaluations.evaluationPeriod, input.evaluationPeriod),
              eq(evaluations.status, "draft")
            )
          )
          .limit(1);

        if (evaluation.length === 0) {
          return { found: false };
        }

        const evalId = evaluation[0].id;

        // Carregar pesos
        const weights = await db
          .select()
          .from(evaluationWeights)
          .where(eq(evaluationWeights.evaluationId, evalId));

        // Carregar scores
        const scores = await db
          .select()
          .from(evaluationScores)
          .where(eq(evaluationScores.evaluationId, evalId));

        // Carregar feedback
        const feedbacks = await db
          .select()
          .from(feedbackRecords)
          .where(eq(feedbackRecords.evaluationId, evalId));

        // Carregar PDI
        const pdi = await db
          .select()
          .from(pdiRecords)
          .where(eq(pdiRecords.evaluationId, evalId))
          .limit(1);

        return {
          found: true,
          evaluation: evaluation[0],
          weights,
          scores,
          feedbacks,
          pdi: pdi.length > 0 ? pdi[0] : null,
        };
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error);
        throw new Error("Falha ao carregar avaliação");
      }
    }),

  // Submeter avaliação (bloqueia edições futuras)
  submitEvaluation: leaderProcedure
    .input(
      z.object({
        evaluationId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: { evaluationId: number } }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        // Verificar se já está bloqueada
        const existingLock = await db
          .select()
          .from(evaluationLocks)
          .where(eq(evaluationLocks.evaluationId, input.evaluationId))
          .limit(1);

        if (existingLock.length > 0) {
          throw new Error("Avaliação já foi submetida e não pode ser editada");
        }

        // Atualizar status para submitted
        await db
          .update(evaluations)
          .set({
            status: "submitted",
            submittedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(evaluations.id, input.evaluationId));

        // Criar bloqueio
        await db.insert(evaluationLocks).values({
          evaluationId: input.evaluationId,
          lockedBy: ctx.user.id,
          reason: "submitted",
          canUnlock: false,
        });

        // Log de auditoria
        await db.insert(auditLogs).values({
          userId: ctx.user.id,
          action: "submit_evaluation",
          entityType: "evaluation",
          entityId: input.evaluationId,
          newValues: {
            status: "submitted",
            submittedAt: new Date(),
          },
          changes: "Avaliação submetida",
          ipAddress: ctx.req.ip || "unknown",
        });

        return {
          success: true,
          message: "Avaliação submetida com sucesso",
        };
      } catch (error) {
        console.error("Erro ao submeter avaliação:", error);
        throw new Error("Falha ao submeter avaliação");
      }
    }),

  // Verificar se avaliação está bloqueada
  isEvaluationLocked: protectedProcedure
    .input(
      z.object({
        evaluationId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        const lock = await db
          .select()
          .from(evaluationLocks)
          .where(eq(evaluationLocks.evaluationId, input.evaluationId))
          .limit(1);

        return {
          isLocked: lock.length > 0,
          lock: lock.length > 0 ? lock[0] : null,
        };
      } catch (error) {
        console.error("Erro ao verificar bloqueio:", error);
        throw new Error("Falha ao verificar bloqueio");
      }
    }),
});
