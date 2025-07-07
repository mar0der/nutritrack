-- Fix the user password with a proper bcrypt hash
-- This will set the password to 'password123' for admin@nutritrack.local

-- Delete existing user if any
DELETE FROM "users" WHERE "email" = 'admin@nutritrack.local';

-- Insert user with properly hashed password for 'password123'
INSERT INTO "users" (
    "id", 
    "email", 
    "name", 
    "provider", 
    "passwordHash", 
    "emailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    'default-user-id-123',
    'admin@nutritrack.local',
    'Default User', 
    'email',
    '$2b$12$LQv3c1yqBwrJFOT6Ev4SL.KmE/4LcB9sAP4FV8JG8NHG.XsKEwzWy',
    true,
    NOW(),
    NOW()
);

-- Also create a simple test user
INSERT INTO "users" (
    "id", 
    "email", 
    "name", 
    "provider", 
    "passwordHash", 
    "emailVerified",
    "createdAt",
    "updatedAt"
) VALUES (
    'test-user-id-456',
    'test@test.com',
    'Test User', 
    'email',
    '$2b$12$LQv3c1yqBwrJFOT6Ev4SL.KmE/4LcB9sAP4FV8JG8NHG.XsKEwzWy',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Update existing consumption_logs and user_preferences to use the default user
UPDATE "consumption_logs" SET "userId" = 'default-user-id-123' WHERE "userId" IS NULL;
UPDATE "user_preferences" SET "userId" = 'default-user-id-123' WHERE "userId" IS NULL;