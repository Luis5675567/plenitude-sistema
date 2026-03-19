CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"enrollment_date" date NOT NULL,
	"due_date" date NOT NULL,
	"photo" text
);
