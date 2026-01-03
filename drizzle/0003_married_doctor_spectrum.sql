CREATE TABLE `evaluation_weights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`competencyId` int NOT NULL,
	`weight` int NOT NULL,
	`remainingCredit` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evaluation_weights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feedback_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`employeeId` int NOT NULL,
	`feedbackType` enum('strengths','improvements','development-areas','general') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feedback_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pdi_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`evaluationId` int NOT NULL,
	`employeeId` int NOT NULL,
	`competencyId` int,
	`developmentArea` text NOT NULL,
	`actions` text NOT NULL,
	`timeline` varchar(100),
	`responsible` varchar(255),
	`status` enum('planned','in-progress','completed','postponed') NOT NULL DEFAULT 'planned',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pdi_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `evaluation_scores` ADD `weight` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `evaluation_scores` ADD `weightedScore` decimal(5,2);--> statement-breakpoint
ALTER TABLE `evaluations` ADD `employeeName` varchar(255);--> statement-breakpoint
ALTER TABLE `evaluations` ADD `employeeCode` varchar(50);--> statement-breakpoint
ALTER TABLE `evaluations` ADD `employeePosition` varchar(255);--> statement-breakpoint
ALTER TABLE `evaluations` ADD `employeeDepartment` varchar(255);--> statement-breakpoint
ALTER TABLE `evaluations` ADD `pdi` text;--> statement-breakpoint
ALTER TABLE `evaluations` ADD `feedback` text;