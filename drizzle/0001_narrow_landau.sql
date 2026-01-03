CREATE TABLE `ai_insights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int,
	`employeeId` int,
	`insightType` enum('competency-gaps','development-plan','performance-analysis','team-patterns') NOT NULL,
	`content` text NOT NULL,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_insights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `behavior_descriptors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competencyId` int NOT NULL,
	`level` int NOT NULL,
	`descriptor` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `behavior_descriptors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`positionId` int NOT NULL,
	`department` varchar(255),
	`managerId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_authorizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leaderId` int NOT NULL,
	`employeeId` int NOT NULL,
	`authorizedBy` int NOT NULL,
	`status` enum('active','inactive','revoked') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluation_authorizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`employeeId` int NOT NULL,
	`evaluationPeriod` varchar(50) NOT NULL,
	`performanceScore` decimal(5,2) NOT NULL,
	`potentialScore` decimal(5,2) NOT NULL,
	`nineBoxPosition` varchar(50) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluation_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`competencyId` int NOT NULL,
	`score` decimal(5,2) NOT NULL,
	`comments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluation_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`leaderId` int NOT NULL,
	`evaluationPeriod` varchar(50),
	`status` enum('draft','submitted','completed') NOT NULL DEFAULT 'draft',
	`performanceScore` decimal(5,2),
	`potentialScore` decimal(5,2),
	`nineBoxPosition` varchar(50),
	`comments` text,
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exported_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('pdf','excel') NOT NULL,
	`reportType` enum('evaluation','nine-box','history','team-analysis') NOT NULL,
	`s3Key` varchar(500) NOT NULL,
	`s3Url` text NOT NULL,
	`generatedBy` int NOT NULL,
	`relatedEvaluationId` int,
	`relatedEmployeeId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `exported_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `position_competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`positionId` int NOT NULL,
	`competencyId` int NOT NULL,
	`expectedLevel` int NOT NULL,
	`weight` decimal(5,2) DEFAULT '1.00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `position_competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`responsibilities` text,
	`requirements` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','leader','employee') NOT NULL DEFAULT 'employee';