-- Create default user and update existing data
-- Run this AFTER running create_auth_tables.sql

-- Insert default user (password hash is for 'password123')
INSERT INTO "users" (
    "id", 
    "email", 
    "name", 
    "provider", 
    "passwordHash", 
    "emailVerified"
) VALUES (
    'default-user-id-123',
    'admin@nutritrack.local',
    'Default User', 
    'email',
    '$2b$12$YQiQxpWqhcT9gKx8pjV5.eJ1B2B1K2B1K2B1K2B1K2B1K2B1K2B1K2',
    true
);

-- Update existing consumption_logs to belong to default user
UPDATE "consumption_logs" SET "userId" = 'default-user-id-123' WHERE "userId" IS NULL;

-- Update existing user_preferences to belong to default user  
UPDATE "user_preferences" SET "userId" = 'default-user-id-123' WHERE "userId" IS NULL;

-- Make userId columns required (run this last)
ALTER TABLE "consumption_logs" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "user_preferences" ALTER COLUMN "userId" SET NOT NULL;