import { z } from "zod";
import { protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { performanceCycles, cycleStatuses } from "../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

export const cyclesRouter = router({
  createCycle: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["bimonthly", "semester"]),
        startDate: z.date(),
        endDate: z.date(),
        parentCycleId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db.insert(performanceCycles).values({
        name: input.name,
        type: input.type,
        startDate: input.startDate,
        endDate: input.endDate,
        parentCycleId: input.parentCycleId,
        status: "planning",
      });

      return { id: result[0].insertId, ...input };
    }),

  listCycles: protectedProcedure
    .input(
      z.object({
        status: z.enum(["planning", "active", "completed", "archived"]).optional(),
        type: z.enum(["bimonthly", "semester"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const conditions: Parameters<typeof and>[0][] = [];

      if (input.status) {
        conditions.push(eq(performanceCycles.status, input.status));
      }

      if (input.type) {
        conditions.push(eq(performanceCycles.type, input.type));
      }

      if (ctx.user?.role !== "admin") {
        conditions.push(eq(performanceCycles.status, "active"));
      }

      if (conditions.length > 0) {
        return db.select().from(performanceCycles).where(and(...conditions));
      }

      return db.select().from(performanceCycles);
    }),

  getCycleById: protectedProcedure
    .input(z.object({ cycleId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const cycle = await db
        .select()
        .from(performanceCycles)
        .where(eq(performanceCycles.id, input.cycleId))
        .limit(1);

      return cycle[0] || null;
    }),

  updateCycleStatus: adminProcedure
    .input(
      z.object({
        cycleId: z.number(),
        status: z.enum(["planning", "active", "completed", "archived"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(performanceCycles)
        .set({ status: input.status })
        .where(eq(performanceCycles.id, input.cycleId));

      return { success: true };
    }),

  getEmployeeCycleStatus: protectedProcedure
    .input(
      z.object({
        cycleId: z.number(),
        employeeId: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const employeeId = input.employeeId || ctx.user?.id;
      if (!employeeId) throw new Error("Employee ID required");

      if (ctx.user?.role !== "admin" && input.employeeId && input.employeeId !== ctx.user?.id) {
        throw new Error("Unauthorized");
      }

      const status = await db
        .select()
        .from(cycleStatuses)
        .where(
          and(
            eq(cycleStatuses.cycleId, input.cycleId),
            eq(cycleStatuses.employeeId, employeeId)
          )
        )
        .limit(1);

      return status[0] || null;
    }),

  updateEmployeeCycleStatus: protectedProcedure
    .input(
      z.object({
        cycleId: z.number(),
        employeeId: z.number().optional(),
        currentStatus: z.enum([
          "planning",
          "self-evaluation",
          "leader-evaluation",
          "feedback",
          "pdi",
          "completed",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const employeeId = input.employeeId || ctx.user?.id;
      if (!employeeId) throw new Error("Employee ID required");

      if (ctx.user?.role !== "admin" && input.employeeId && input.employeeId !== ctx.user?.id) {
        throw new Error("Unauthorized");
      }

      const existing = await db
        .select()
        .from(cycleStatuses)
        .where(
          and(
            eq(cycleStatuses.cycleId, input.cycleId),
            eq(cycleStatuses.employeeId, employeeId)
          )
        )
        .limit(1);

      const now = new Date();
      const statusUpdate: Record<string, unknown> = {
        currentStatus: input.currentStatus,
      };

      if (input.currentStatus === "self-evaluation") {
        statusUpdate.selfEvaluationDate = now;
      } else if (input.currentStatus === "leader-evaluation") {
        statusUpdate.leaderEvaluationDate = now;
      } else if (input.currentStatus === "feedback") {
        statusUpdate.feedbackDate = now;
      } else if (input.currentStatus === "pdi") {
        statusUpdate.pdiDate = now;
      } else if (input.currentStatus === "completed") {
        statusUpdate.completionDate = now;
      }

      if (existing.length > 0) {
        await db
          .update(cycleStatuses)
          .set(statusUpdate)
          .where(
            and(
              eq(cycleStatuses.cycleId, input.cycleId),
              eq(cycleStatuses.employeeId, employeeId)
            )
          );
      } else {
        await db.insert(cycleStatuses).values({
          cycleId: input.cycleId,
          employeeId,
          currentStatus: input.currentStatus,
          ...statusUpdate,
        });
      }

      return { success: true };
    }),

  listCycleStatuses: adminProcedure
    .input(z.object({ cycleId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(cycleStatuses)
        .where(eq(cycleStatuses.cycleId, input.cycleId));
    }),

  getCurrentCycle: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const now = new Date();

    const cycle = await db
      .select()
      .from(performanceCycles)
      .where(
        and(
          eq(performanceCycles.status, "active"),
          lte(performanceCycles.startDate, now),
          gte(performanceCycles.endDate, now)
        )
      )
      .limit(1);

    return cycle[0] || null;
  }),

  getEmployeeCycleHistory: protectedProcedure
    .input(z.object({ employeeId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const employeeId = input.employeeId || ctx.user?.id;
      if (!employeeId) throw new Error("Employee ID required");

      if (ctx.user?.role !== "admin" && input.employeeId && input.employeeId !== ctx.user?.id) {
        throw new Error("Unauthorized");
      }

      return db
        .select()
        .from(cycleStatuses)
        .where(eq(cycleStatuses.employeeId, employeeId));
    }),

  getCycleProgress: adminProcedure
    .input(z.object({ cycleId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const statuses = await db
        .select()
        .from(cycleStatuses)
        .where(eq(cycleStatuses.cycleId, input.cycleId));

      if (statuses.length === 0) {
        return {
          total: 0,
          completed: 0,
          inProgress: 0,
          pending: 0,
          overdue: 0,
          percentageCompleted: 0,
        };
      }

      const completed = statuses.filter((s) => s.currentStatus === "completed").length;
      const inProgress = statuses.filter(
        (s) => ["self-evaluation", "leader-evaluation", "feedback", "pdi"].includes(s.currentStatus)
      ).length;
      const overdue = statuses.filter((s) => s.isOverdue).length;
      const pending = statuses.filter((s) => s.currentStatus === "planning").length;

      return {
        total: statuses.length,
        completed,
        inProgress,
        pending,
        overdue,
        percentageCompleted: Math.round((completed / statuses.length) * 100),
      };
    }),
});
