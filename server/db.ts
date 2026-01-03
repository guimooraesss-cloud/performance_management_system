import { eq, and, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  employees,
  positions,
  competencies,
  positionCompetencies,
  evaluations,
  evaluationScores,
  evaluationAuthorizations,
  behaviorDescriptors,
  evaluationHistory,
  aiInsights,
  exportedReports,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Helpers para Posições
export async function getAllPositions() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(positions);
}

export async function getPositionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(positions).where(eq(positions.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Helpers para Competências
export async function getAllCompetencies() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(competencies);
}

export async function getCompetencyById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(competencies).where(eq(competencies.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Helpers para Comportamentos
export async function getBehaviorDescriptorsByCompetency(competencyId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(behaviorDescriptors).where(eq(behaviorDescriptors.competencyId, competencyId));
}

// Helpers para Competências de Posição
export async function getPositionCompetencies(positionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(positionCompetencies).where(eq(positionCompetencies.positionId, positionId));
}

// Helpers para Colaboradores
export async function getEmployeeByUserId(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(employees).where(eq(employees.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getEmployeesByManager(managerId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(employees).where(eq(employees.managerId, managerId));
}

// Helpers para Autorizações de Avaliação
export async function getEvaluationAuthorizations(leaderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(evaluationAuthorizations).where(
    and(
      eq(evaluationAuthorizations.leaderId, leaderId),
      eq(evaluationAuthorizations.status, "active")
    )
  );
}

export async function checkEvaluationAuthorization(leaderId: number, employeeId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(evaluationAuthorizations).where(
    and(
      eq(evaluationAuthorizations.leaderId, leaderId),
      eq(evaluationAuthorizations.employeeId, employeeId),
      eq(evaluationAuthorizations.status, "active")
    )
  ).limit(1);
  return result.length > 0;
}

// Helpers para Avaliações
export async function getEvaluationById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(evaluations).where(eq(evaluations.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getEvaluationsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(evaluations).where(eq(evaluations.employeeId, employeeId));
}

export async function getEvaluationsByLeader(leaderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(evaluations).where(eq(evaluations.leaderId, leaderId));
}

// Helpers para Notas de Avaliação
export async function getEvaluationScores(evaluationId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(evaluationScores).where(eq(evaluationScores.evaluationId, evaluationId));
}

// Helpers para Histórico
export async function getEmployeeEvaluationHistory(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(evaluationHistory).where(eq(evaluationHistory.employeeId, employeeId));
}

// Helpers para Insights de IA
export async function getAIInsightsByEmployee(employeeId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(aiInsights).where(eq(aiInsights.employeeId, employeeId));
}

// Helpers para Relatórios Exportados
export async function getExportedReportsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(exportedReports).where(eq(exportedReports.generatedBy, userId));
}
