-- Migration: 002_add_user_fields.sql
-- Description: Add missing user fields and enhance existing tables
-- Date: 2025-08-26

-- Add missing columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50),
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS location VARCHAR(100),
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Add missing columns to routes table
ALTER TABLE routes 
ADD COLUMN IF NOT EXISTS elevation_loss INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS region VARCHAR(50),
ADD COLUMN IF NOT EXISTS waypoints JSONB,
ADD COLUMN IF NOT EXISTS surface_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS route_type VARCHAR(50) DEFAULT 'trail',
ADD COLUMN IF NOT EXISTS estimated_time INTEGER,
ADD COLUMN IF NOT EXISTS best_season VARCHAR(100),
ADD COLUMN IF NOT EXISTS highlights TEXT[],
ADD COLUMN IF NOT EXISTS warnings TEXT[],
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);

-- Add missing columns to user_runs table
ALTER TABLE user_runs 
ADD COLUMN IF NOT EXISTS average_speed DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS max_speed DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS calories_burned INTEGER,
ADD COLUMN IF NOT EXISTS elevation_loss INTEGER,
ADD COLUMN IF NOT EXISTS weather_conditions JSONB,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true;

-- Add missing columns to leaderboard table
ALTER TABLE leaderboard 
ADD COLUMN IF NOT EXISTS total_duration INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_pace DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS fastest_pace DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS last_run_date TIMESTAMP;

-- Create achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    criteria JSONB NOT NULL,
    points INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_achievements table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Create challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_distance DECIMAL(10,2),
    target_runs INTEGER,
    target_elevation INTEGER,
    district VARCHAR(50),
    difficulty VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_challenges table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress JSONB DEFAULT '{}',
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add additional indexes
CREATE INDEX IF NOT EXISTS idx_user_runs_start_time ON user_runs(start_time);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
