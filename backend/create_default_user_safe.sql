-- Create default user and update existing data (safe version)
-- This script checks if user exists before creating

-- Insert default user only if it doesn't exist
INSERT INTO "users" (
    "id", 
    "email", 
    "name", 
    "provider", 
    "passwordHash", 
    "emailVerified"
) 
SELECT 
    'default-user-id-123',
    'admin@nutritrack.local',
    'Default User', 
    'email',
    '$2b$12$LQv3c1yqBwrJFOT6Ev4SL.KmE/4LcB9sAP4FV8JG8NHG.XsKEwzWy',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM "users" WHERE "email" = 'admin@nutritrack.local'
);

-- Update existing consumption_logs to belong to default user (only NULL values)
UPDATE "consumption_logs" 
SET "userId" = 'default-user-id-123' 
WHERE "userId" IS NULL;

-- Update existing user_preferences to belong to default user (only NULL values)
UPDATE "user_preferences" 
SET "userId" = 'default-user-id-123' 
WHERE "userId" IS NULL;

-- Make userId columns required if they're not already
DO $$
BEGIN
    -- Check if consumption_logs.userId is nullable
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'consumption_logs' 
               AND column_name = 'userId' 
               AND is_nullable = 'YES') THEN
        ALTER TABLE "consumption_logs" ALTER COLUMN "userId" SET NOT NULL;
    END IF;
    
    -- Check if user_preferences.userId is nullable
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'user_preferences' 
               AND column_name = 'userId' 
               AND is_nullable = 'YES') THEN
        ALTER TABLE "user_preferences" ALTER COLUMN "userId" SET NOT NULL;
    END IF;
END $$;