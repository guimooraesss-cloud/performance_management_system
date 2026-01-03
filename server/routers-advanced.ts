/**
 * Routers avançados para pesos ponderados, feedback e PDI
 * Estes serão integrados ao arquivo routers.ts principal
 */

import { router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

// Procedimento protegido apenas para líderes
const leaderProcedure = protectedProcedure.use(({ ctx, next }: any) => {
  if (ctx.user.role !== "leader" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas líderes podem acessar" });
  }
  return next({ ctx });
});
import { z } from "zod";
import { getDb, getEvaluationById } from "./db";
import { evaluationWeights, feedbackRecords, pdiRecords } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const advancedRouters = {
  // Routers para Pesos Ponderados
  evaluationWeights: router({
    getByEvaluation: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }: any) => {
        const db = await getDb();
        if (!db) return [];
        return db
          .select()
          .from(evaluationWeights)
          .where(eq(evaluationWeights.evaluationId, input.evaluationId));
      }),
    create: leaderProcedure
      .input(
        z.object({
          evaluationId: z.number(),
          competencyId: z.number(),
          weight: z.number().min(0).max(100),
          remainingCredit: z.number().min(0).max(100),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const evaluation = await getEvaluationById(input.evaluationId);
        if (!evaluation || evaluation.leaderId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const result = await db.insert(evaluationWeights).values(input);
        return { id: result[0].insertId };
      }),
    update: leaderProcedure
      .input(
        z.object({
          id: z.number(),
          weight: z.number().min(0).max(100),
          remainingCredit: z.number().min(0).max(100),
        })
      )
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, ...data } = input;
        await db.update(evaluationWeights).set(data).where(eq(evaluationWeights.id, id));
        return { success: true };
      }),
  }),

  // Routers para Feedback
  feedback: router({
    getByEvaluation: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }: any) => {
        const db = await getDb();
        if (!db) return [];
        return db
          .select()
          .from(feedbackRecords)
          .where(eq(feedbackRecords.evaluationId, input.evaluationId));
      }),
    create: leaderProcedure
      .input(
        z.object({
          evaluationId: z.number(),
          employeeId: z.number(),
          feedbackType: z.enum(["strengths", "improvements", "development-areas", "general"]),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const evaluation = await getEvaluationById(input.evaluationId);
        if (!evaluation || evaluation.leaderId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const result = await db.insert(feedbackRecords).values(input);
        return { id: result[0].insertId };
      }),
    update: leaderProcedure
      .input(
        z.object({
          id: z.number(),
          content: z.string().min(1),
        })
      )
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, content } = input;
        await db.update(feedbackRecords).set({ content }).where(eq(feedbackRecords.id, id));
        return { success: true };
      }),
  }),

  // Routers para PDI
  pdi: router({
    getByEvaluation: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(async ({ input }: any) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(pdiRecords).where(eq(pdiRecords.evaluationId, input.evaluationId));
      }),
    create: leaderProcedure
      .input(
        z.object({
          evaluationId: z.number(),
          employeeId: z.number(),
          competencyId: z.number().optional(),
          developmentArea: z.string().min(1),
          actions: z.string().min(1),
          timeline: z.string().optional(),
          responsible: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }: any) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const evaluation = await getEvaluationById(input.evaluationId);
        if (!evaluation || evaluation.leaderId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const result = await db.insert(pdiRecords).values({
          ...input,
          status: "planned",
        });
        return { id: result[0].insertId };
      }),
    update: leaderProcedure
      .input(
        z.object({
          id: z.number(),
          developmentArea: z.string().min(1).optional(),
          actions: z.string().min(1).optional(),
          timeline: z.string().optional(),
          responsible: z.string().optional(),
          status: z.enum(["planned", "in-progress", "completed", "postponed"]).optional(),
        })
      )
      .mutation(async ({ input }: any) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, ...data } = input;
        await db.update(pdiRecords).set(data).where(eq(pdiRecords.id, id));
        return { success: true };
      }),
  }),
};
