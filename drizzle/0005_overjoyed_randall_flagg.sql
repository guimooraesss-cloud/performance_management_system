CREATE TABLE `audit_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50) NOT NULL,
	`entityId` int NOT NULL,
	`oldValues` json,
	`newValues` json,
	`changes` text,
	`ipAddress` varchar(50),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `evaluation_locks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`lockedAt` timestamp NOT NULL DEFAULT (now()),
	`lockedBy` int NOT NULL,
	`reason` varchar(255),
	`canUnlock` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `evaluation_locks_id` PRIMARY KEY(`id`),
	CONSTRAINT `evaluation_locks_evaluationId_unique` UNIQUE(`evaluationId`)
);
