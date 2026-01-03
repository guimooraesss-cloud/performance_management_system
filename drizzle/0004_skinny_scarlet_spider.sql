CREATE TABLE `cycle_statuses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cycleId` int NOT NULL,
	`employeeId` int NOT NULL,
	`currentStatus` enum('planning','self-evaluation','leader-evaluation','feedback','pdi','completed') NOT NULL DEFAULT 'planning',
	`statusHistory` json,
	`selfEvaluationDate` timestamp,
	`leaderEvaluationDate` timestamp,
	`feedbackDate` timestamp,
	`pdiDate` timestamp,
	`completionDate` timestamp,
	`isOverdue` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cycle_statuses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_cycles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('bimonthly','semester') NOT NULL,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`parentCycleId` int,
	`status` enum('planning','active','completed','archived') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `performance_cycles_id` PRIMARY KEY(`id`)
);
