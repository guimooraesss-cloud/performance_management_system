import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Roles: admin (RH Master), leader (Líder), employee (Liderado)
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "leader", "employee"]).default("employee").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Cargos (Positions)
 */
export const positions = mysqlTable("positions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  responsibilities: text("responsibilities"), // JSON array of responsibilities
  requirements: text("requirements"), // JSON array of requirements
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Position = typeof positions.$inferSelect;
export type InsertPosition = typeof positions.$inferInsert;

/**
 * Competências (Skills/Competencies)
 */
export const competencies = mysqlTable("competencies", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // e.g., "Technical", "Behavioral", "Leadership"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Competency = typeof competencies.$inferSelect;
export type InsertCompetency = typeof competencies.$inferInsert;

/**
 * Descritores de Comportamento por Competência e Nível
 * Exemplo: Competência "Liderança", Nível 3, Descritor: "Inspira e motiva equipes..."
 */
export const behaviorDescriptors = mysqlTable("behavior_descriptors", {
  id: int("id").autoincrement().primaryKey(),
  competencyId: int("competencyId").notNull(),
  level: int("level").notNull(), // 1-5 scale
  descriptor: text("descriptor").notNull(), // Descrição comportamental
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BehaviorDescriptor = typeof behaviorDescriptors.$inferSelect;
export type InsertBehaviorDescriptor = typeof behaviorDescriptors.$inferInsert;

/**
 * Mapeamento de Competências por Cargo
 * Define quais competências são esperadas para cada cargo e em qual nível
 */
export const positionCompetencies = mysqlTable("position_competencies", {
  id: int("id").autoincrement().primaryKey(),
  positionId: int("positionId").notNull(),
  competencyId: int("competencyId").notNull(),
  expectedLevel: int("expectedLevel").notNull(), // Nível esperado (1-5)
  weight: decimal("weight", { precision: 3, scale: 2 }).default("1.00"), // Peso da competência
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PositionCompetency = typeof positionCompetencies.$inferSelect;
export type InsertPositionCompetency = typeof positionCompetencies.$inferInsert;

/**
 * Colaboradores (Employees)
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Referência ao usuário (liderado)
  positionId: int("positionId").notNull(), // Cargo atual
  department: varchar("department", { length: 255 }),
  managerId: int("managerId"), // ID do líder direto (outro usuário)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Autorizações de Avaliação
 * RH autoriza qual líder pode avaliar qual liderado
 */
export const evaluationAuthorizations = mysqlTable("evaluation_authorizations", {
  id: int("id").autoincrement().primaryKey(),
  leaderId: int("leaderId").notNull(), // ID do líder (user)
  employeeId: int("employeeId").notNull(), // ID do colaborador (employee)
  authorizedBy: int("authorizedBy").notNull(), // ID do RH que autorizou
  status: mysqlEnum("status", ["active", "inactive", "revoked"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationAuthorization = typeof evaluationAuthorizations.$inferSelect;
export type InsertEvaluationAuthorization = typeof evaluationAuthorizations.$inferInsert;

/**
 * Avaliações (Evaluations)
 */
export const evaluations = mysqlTable("evaluations", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull(), // Colaborador sendo avaliado
  leaderId: int("leaderId").notNull(), // Líder que avalia
  employeeName: varchar("employeeName", { length: 255 }), // Nome do colaborador
  employeeCode: varchar("employeeCode", { length: 50 }), // Código do colaborador
  employeePosition: varchar("employeePosition", { length: 255 }), // Cargo do colaborador
  employeeDepartment: varchar("employeeDepartment", { length: 255 }), // Setor do colaborador
  evaluationPeriod: varchar("evaluationPeriod", { length: 50 }), // e.g., "2024-Q1"
  status: mysqlEnum("status", ["draft", "submitted", "completed"]).default("draft").notNull(),
  performanceScore: decimal("performanceScore", { precision: 3, scale: 1 }), // Calculado automaticamente
  potentialScore: decimal("potentialScore", { precision: 3, scale: 1 }), // Calculado automaticamente
  nineBoxPosition: varchar("nineBoxPosition", { length: 50 }), // e.g., "high-performer", "core-employee"
  comments: text("comments"), // Comentários gerais do avaliador
  pdi: text("pdi"), // Plano de Desenvolvimento Individual
  feedback: text("feedback"), // Registro de Feedback estruturado
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Evaluation = typeof evaluations.$inferSelect;
export type InsertEvaluation = typeof evaluations.$inferInsert;

/**
 * Notas de Competências por Avaliação
 * Armazena a nota de cada competência em uma avaliação
 */
export const evaluationScores = mysqlTable("evaluation_scores", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  competencyId: int("competencyId").notNull(),
  score: decimal("score", { precision: 3, scale: 1 }).notNull(), // Nota (1-5)
  weight: int("weight").default(0), // Peso ponderado (0-100)
  weightedScore: decimal("weightedScore", { precision: 5, scale: 2 }), // Nota * Peso / 100
  comments: text("comments"), // Comentários específicos da competência
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationScore = typeof evaluationScores.$inferSelect;
export type InsertEvaluationScore = typeof evaluationScores.$inferInsert;

/**
 * Pesos Ponderados por Avaliação
 * Rastreia a distribuição de pesos (0-100) entre competências
 */
export const evaluationWeights = mysqlTable("evaluation_weights", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  competencyId: int("competencyId").notNull(),
  weight: int("weight").notNull(), // Peso (0-100)
  remainingCredit: int("remainingCredit").notNull(), // Crédito restante após esta atribuição
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluationWeight = typeof evaluationWeights.$inferSelect;
export type InsertEvaluationWeight = typeof evaluationWeights.$inferInsert;

/**
 * Histórico de Avaliações
 * Mantém registro completo de todas as avaliações passadas
 */
export const evaluationHistory = mysqlTable("evaluation_history", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  employeeId: int("employeeId").notNull(),
  evaluationPeriod: varchar("evaluationPeriod", { length: 50 }).notNull(),
  performanceScore: decimal("performanceScore", { precision: 3, scale: 1 }).notNull(),
  potentialScore: decimal("potentialScore", { precision: 3, scale: 1 }).notNull(),
  nineBoxPosition: varchar("nineBoxPosition", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EvaluationHistory = typeof evaluationHistory.$inferSelect;
export type InsertEvaluationHistory = typeof evaluationHistory.$inferInsert;

/**
 * Registros de Feedback
 * Armazena feedback estruturado por avaliação
 */
export const feedbackRecords = mysqlTable("feedback_records", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  employeeId: int("employeeId").notNull(),
  feedbackType: mysqlEnum("feedbackType", ["strengths", "improvements", "development-areas", "general"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FeedbackRecord = typeof feedbackRecords.$inferSelect;
export type InsertFeedbackRecord = typeof feedbackRecords.$inferInsert;

/**
 * Planos de Desenvolvimento Individual (PDI)
 * Armazena PDI estruturado por colaborador
 */
export const pdiRecords = mysqlTable("pdi_records", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull(),
  employeeId: int("employeeId").notNull(),
  competencyId: int("competencyId"),
  developmentArea: text("developmentArea").notNull(), // Área de desenvolvimento
  actions: text("actions").notNull(), // Ações a realizar
  timeline: varchar("timeline", { length: 100 }), // Prazo (ex: "3 meses", "6 meses")
  responsible: varchar("responsible", { length: 255 }), // Responsável
  status: mysqlEnum("status", ["planned", "in-progress", "completed", "postponed"]).default("planned").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PDIRecord = typeof pdiRecords.$inferSelect;
export type InsertPDIRecord = typeof pdiRecords.$inferInsert;

/**
 * Análises e Insights Gerados por IA
 */
export const aiInsights = mysqlTable("ai_insights", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId"),
  employeeId: int("employeeId"),
  insightType: mysqlEnum("insightType", [
    "competency-gaps",
    "development-plan",
    "performance-analysis",
    "team-patterns",
  ]).notNull(),
  content: text("content").notNull(), // Conteúdo da análise em markdown
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AIInsight = typeof aiInsights.$inferSelect;
export type InsertAIInsight = typeof aiInsights.$inferInsert;

/**
 * Relatórios Exportados
 * Rastreia relatórios gerados e armazenados no S3
 */
export const exportedReports = mysqlTable("exported_reports", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["pdf", "excel"]).notNull(),
  reportType: mysqlEnum("reportType", [
    "evaluation",
    "nine-box",
    "history",
    "team-analysis",
  ]).notNull(),
  s3Key: varchar("s3Key", { length: 500 }).notNull(), // Chave no S3
  s3Url: text("s3Url").notNull(), // URL pública do S3
  generatedBy: int("generatedBy").notNull(), // ID do usuário que gerou
  relatedEvaluationId: int("relatedEvaluationId"),
  relatedEmployeeId: int("relatedEmployeeId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExportedReport = typeof exportedReports.$inferSelect;
export type InsertExportedReport = typeof exportedReports.$inferInsert;


/**
 * Ciclos de Gestão de Desempenho
 * Controla ciclos semestrais com avaliações bimestrais
 */
export const performanceCycles = mysqlTable("performance_cycles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["bimonthly", "semester"]).notNull(),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  parentCycleId: int("parentCycleId"),
  status: mysqlEnum("status", ["planning", "active", "completed", "archived"]).default("planning").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PerformanceCycle = typeof performanceCycles.$inferSelect;
export type InsertPerformanceCycle = typeof performanceCycles.$inferInsert;

/**
 * Status do Ciclo por Colaborador
 * Rastreia o progresso de cada colaborador em cada ciclo
 */
export const cycleStatuses = mysqlTable("cycle_statuses", {
  id: int("id").autoincrement().primaryKey(),
  cycleId: int("cycleId").notNull(),
  employeeId: int("employeeId").notNull(),
  currentStatus: mysqlEnum("currentStatus", [
    "planning",
    "self-evaluation",
    "leader-evaluation",
    "feedback",
    "pdi",
    "completed",
  ]).default("planning").notNull(),
  statusHistory: json("statusHistory"),
  selfEvaluationDate: timestamp("selfEvaluationDate"),
  leaderEvaluationDate: timestamp("leaderEvaluationDate"),
  feedbackDate: timestamp("feedbackDate"),
  pdiDate: timestamp("pdiDate"),
  completionDate: timestamp("completionDate"),
  isOverdue: boolean("isOverdue").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CycleStatus = typeof cycleStatuses.$inferSelect;
export type InsertCycleStatus = typeof cycleStatuses.$inferInsert;


/**
 * Logs de Auditoria
 * Rastreia todas as ações no sistema para compliance e segurança
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(), // ex: "create_evaluation", "update_evaluation", "submit_evaluation"
  entityType: varchar("entityType", { length: 50 }).notNull(), // ex: "evaluation", "feedback", "pdi"
  entityId: int("entityId").notNull(),
  oldValues: json("oldValues"), // Valores anteriores (para edições)
  newValues: json("newValues"), // Novos valores
  changes: text("changes"), // Descrição das mudanças
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Bloqueios de Avaliação
 * Impede edição de avaliações já submetidas
 */
export const evaluationLocks = mysqlTable("evaluation_locks", {
  id: int("id").autoincrement().primaryKey(),
  evaluationId: int("evaluationId").notNull().unique(),
  lockedAt: timestamp("lockedAt").defaultNow().notNull(),
  lockedBy: int("lockedBy").notNull(),
  reason: varchar("reason", { length: 255 }), // ex: "submitted", "approved"
  canUnlock: boolean("canUnlock").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EvaluationLock = typeof evaluationLocks.$inferSelect;
export type InsertEvaluationLock = typeof evaluationLocks.$inferInsert;
