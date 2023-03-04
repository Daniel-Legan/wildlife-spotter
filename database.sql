-- Database Name: wildlife_spotter

DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS "marker";
DROP TABLE IF EXISTS "animal";
DROP TABLE IF EXISTS "favorite";

CREATE TABLE "user" (
	"id" serial PRIMARY KEY,
	"username" VARCHAR (80) UNIQUE NOT NULL,
	"password" VARCHAR (1000) NOT NULL
	);
	
CREATE TABLE "marker" (
	"id" serial PRIMARY KEY,
	"user_id" int REFERENCES "user",
	"animal_id" int REFERENCES "animal",
	"lat" DECIMAL(10, 7) NOT NULL,
	"lng" DECIMAL(10, 7) NOT NULL,
	"description" VARCHAR,
	"time" TIMESTAMP DEFAULT NOW() NOT NULL
	);
	
CREATE TABLE "animal" (
	"id" serial PRIMARY KEY,
	"animal" VARCHAR (255) UNIQUE NOT NULL,
	"img" VARCHAR (255) UNIQUE NOT NULL
	);
	
CREATE TABLE "favorite" (
	"id" serial PRIMARY KEY,
	"user_id" int REFERENCES "user",
	"place_id" VARCHAR,
	"address" VARCHAR,
	"lat" DECIMAL(10, 7) NOT NULL,
	"lng" DECIMAL(10, 7) NOT NULL
	);