ALTER TABLE `evaluation_history` MODIFY COLUMN `performanceScore` decimal(3,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `evaluation_history` MODIFY COLUMN `potentialScore` decimal(3,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `evaluation_scores` MODIFY COLUMN `score` decimal(3,1) NOT NULL;--> statement-breakpoint
ALTER TABLE `evaluations` MODIFY COLUMN `performanceScore` decimal(3,1);--> statement-breakpoint
ALTER TABLE `evaluations` MODIFY COLUMN `potentialScore` decimal(3,1);--> statement-breakpoint
ALTER TABLE `position_competencies` MODIFY COLUMN `weight` decimal(3,2) DEFAULT '1.00';