import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { cyclesRouter } from "./routers-cycles";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAllPositions,
  getPositionById,
  getAllCompetencies,
  getCompetencyById,
  getBehaviorDescriptorsByCompetency,
  getPositionCompetencies,
  getEmployeeByUserId,
  getEmployeeById,
  getEmployeesByManager,
  getEvaluationAuthorizations,
  checkEvaluationAuthorization,
  getEvaluationById,
  getEvaluationsByEmployee,
  getEvaluationsByLeader,
  getEvaluationScores,
  getEmployeeEvaluationHistory,
  getAIInsightsByEmployee,
  getExportedReportsByUser,
} from "./db";
import { getDb } from "./db";
import {
  positions,
  competencies,
  positionCompetencies,
  employees,
  evaluationAuthorizations,
  evaluations,
  evaluationScores,
  behaviorDescriptors,
  users,
  evaluationWeights,
  feedbackRecords,
  pdiRecords,
} from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { advancedRouters } from "./routers-advanced";
import { persistenceRouter } from "./routers-persistence";

// Procedimento protegido apenas para admins (RH Master)
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas RH Master pode acessar" });
  }
  return next({ ctx });
});

// Procedimento protegido apenas para líderes
const leaderProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "leader" && ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Apenas líderes podem acessar" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  cycles: cyclesRouter,
  persistence: persistenceRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers para Posições
  positions: router({
    list: protectedProcedure.query(() => getAllPositions()),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(({ input }) => getPositionById(input.id)),
    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          responsibilities: z.string().optional(),
          requirements: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const result = await db.insert(positions).values(input);
        return { id: result[0].insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          responsibilities: z.string().optional(),
          requirements: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, ...data } = input;
        await db.update(positions).set(data).where(eq(positions.id, id));
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.delete(positions).where(eq(positions.id, input.id));
        return { success: true };
      }),
  }),

  // Routers para Competências
  competencies: router({
    list: protectedProcedure.query(() => getAllCompetencies()),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(({ input }) => getCompetencyById(input.id)),
    create: adminProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const result = await db.insert(competencies).values(input);
        return { id: result[0].insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          category: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, ...data } = input;
        await db.update(competencies).set(data).where(eq(competencies.id, id));
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.delete(competencies).where(eq(competencies.id, input.id));
        return { success: true };
      }),
    getBehaviors: protectedProcedure
      .input(z.object({ competencyId: z.number() }))
      .query(({ input }) => getBehaviorDescriptorsByCompetency(input.competencyId)),
  }),

  // Routers para Mapeamento de Competências de Posição
  positionCompetencies: router({
    getByPosition: protectedProcedure
      .input(z.object({ positionId: z.number() }))
      .query(({ input }) => getPositionCompetencies(input.positionId)),
    create: adminProcedure
      .input(
        z.object({
          positionId: z.number(),
          competencyId: z.number(),
          expectedLevel: z.number(),
          weight: z.number().min(0).max(10).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const result = await db.insert(positionCompetencies).values({
          positionId: input.positionId,
          competencyId: input.competencyId,
          expectedLevel: input.expectedLevel,
          weight: input.weight ? (input.weight.toFixed(2) as any) : ("1.00" as any),
        });
        return { id: result[0].insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          expectedLevel: z.number().optional(),
          weight: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, weight, expectedLevel } = input;
        const updateData: any = {};
        if (expectedLevel !== undefined) {
          updateData.expectedLevel = expectedLevel;
        }
        if (weight !== undefined) {
          updateData.weight = weight.toFixed(2) as any;
        }
        await db.update(positionCompetencies).set(updateData).where(eq(positionCompetencies.id, id));
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.delete(positionCompetencies).where(eq(positionCompetencies.id, input.id));
        return { success: true };
      }),
  }),

  // Routers para Colaboradores
  employees: router({
    getByUserId: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(({ input }) => getEmployeeByUserId(input.userId)),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEmployeeById(input.id)),
    getByManager: leaderProcedure
      .input(z.object({ managerId: z.number() }))
      .query(({ input }) => getEmployeesByManager(input.managerId)),
    create: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          positionId: z.number(),
          department: z.string().optional(),
          managerId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const result = await db.insert(employees).values(input);
        return { id: result[0].insertId };
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          positionId: z.number().optional(),
          department: z.string().optional(),
          managerId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, ...data } = input;
        await db.update(employees).set(data).where(eq(employees.id, id));
        return { success: true };
      }),
  }),

  // Routers para Autorizações de Avaliação
  evaluationAuthorizations: router({
    getByLeader: adminProcedure
      .input(z.object({ leaderId: z.number() }))
      .query(({ input }) => getEvaluationAuthorizations(input.leaderId)),
    checkAuthorization: leaderProcedure
      .input(z.object({ leaderId: z.number(), employeeId: z.number() }))
      .query(({ input }) => checkEvaluationAuthorization(input.leaderId, input.employeeId)),
    create: adminProcedure
      .input(
        z.object({
          leaderId: z.number(),
          employeeId: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const result = await db.insert(evaluationAuthorizations).values({
          ...input,
          authorizedBy: ctx.user.id,
          status: "active",
        });
        return { id: result[0].insertId };
      }),
    revoke: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.update(evaluationAuthorizations).set({ status: "revoked" }).where(eq(evaluationAuthorizations.id, input.id));
        return { success: true };
      }),
  }),

  // Routers para Avaliações
  evaluations: router({
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getEvaluationById(input.id)),
    getByEmployee: protectedProcedure
      .input(z.object({ employeeId: z.number() }))
      .query(({ input }) => getEvaluationsByEmployee(input.employeeId)),
    getByLeader: leaderProcedure
      .input(z.object({ leaderId: z.number() }))
      .query(({ input }) => getEvaluationsByLeader(input.leaderId)),
    create: leaderProcedure
      .input(
        z.object({
          employeeId: z.number(),
          evaluationPeriod: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const authorized = await checkEvaluationAuthorization(ctx.user.id, input.employeeId);
        if (!authorized) throw new TRPCError({ code: "FORBIDDEN", message: "Não autorizado para avaliar este colaborador" });
        const result = await db.insert(evaluations).values({
          ...input,
          leaderId: ctx.user.id,
          status: "draft",
        });
        return { id: result[0].insertId };
      }),
    update: leaderProcedure
      .input(
        z.object({
          id: z.number(),
          comments: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const evaluation = await getEvaluationById(input.id);
        if (!evaluation || evaluation.leaderId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const { id, ...data } = input;
        await db.update(evaluations).set(data).where(eq(evaluations.id, id));
        return { success: true };
      }),
    submit: leaderProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const evaluation = await getEvaluationById(input.id);
        if (!evaluation || evaluation.leaderId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.update(evaluations).set({ status: "submitted", submittedAt: new Date() }).where(eq(evaluations.id, input.id));
        return { success: true };
      }),
  }),

  // Routers para Pesos Ponderados
  evaluationWeights: advancedRouters.evaluationWeights,

  // Routers para Feedback
  feedback: advancedRouters.feedback,

  // Routers para PDI
  pdi: advancedRouters.pdi,

  // Routers para Notas de Avaliação
  evaluationScores: router({
    getByEvaluation: protectedProcedure
      .input(z.object({ evaluationId: z.number() }))
      .query(({ input }) => getEvaluationScores(input.evaluationId)),
    create: leaderProcedure
      .input(
        z.object({
          evaluationId: z.number(),
          competencyId: z.number(),
          score: z.number().min(1).max(5),
          comments: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const evaluation = await getEvaluationById(input.evaluationId);
        if (!evaluation || evaluation.leaderId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const result = await db.insert(evaluationScores).values({
          evaluationId: input.evaluationId,
          competencyId: input.competencyId,
          score: input.score.toFixed(1) as any,
          comments: input.comments,
        });
        return { id: result[0].insertId };
      }),
    update: leaderProcedure
      .input(
        z.object({
          id: z.number(),
          score: z.number().min(1).max(5).optional(),
          comments: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { id, score, comments } = input;
        const updateData: any = {};
        if (score !== undefined) {
          updateData.score = score.toFixed(1) as any;
        }
        if (comments !== undefined) {
          updateData.comments = comments;
        }
        await db.update(evaluationScores).set(updateData).where(eq(evaluationScores.id, id));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
