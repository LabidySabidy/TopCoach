-- ============================================================
-- TopCoach — Exercise Library Seed
-- Run this after 001_initial_schema.sql
-- ============================================================

insert into public.exercises (name, muscle_group, is_custom) values

  -- Chest
  ('Bench Press', 'Chest', false),
  ('Incline Bench Press', 'Chest', false),
  ('Decline Bench Press', 'Chest', false),
  ('Dumbbell Fly', 'Chest', false),
  ('Push Up', 'Chest', false),
  ('Cable Crossover', 'Chest', false),

  -- Back
  ('Deadlift', 'Back', false),
  ('Pull Up', 'Back', false),
  ('Lat Pulldown', 'Back', false),
  ('Barbell Row', 'Back', false),
  ('Dumbbell Row', 'Back', false),
  ('Seated Cable Row', 'Back', false),
  ('Face Pull', 'Back', false),

  -- Legs
  ('Squat', 'Legs', false),
  ('Front Squat', 'Legs', false),
  ('Romanian Deadlift', 'Legs', false),
  ('Leg Press', 'Legs', false),
  ('Leg Extension', 'Legs', false),
  ('Leg Curl', 'Legs', false),
  ('Walking Lunge', 'Legs', false),
  ('Bulgarian Split Squat', 'Legs', false),
  ('Calf Raise', 'Legs', false),
  ('Hip Thrust', 'Legs', false),

  -- Shoulders
  ('Overhead Press', 'Shoulders', false),
  ('Dumbbell Shoulder Press', 'Shoulders', false),
  ('Lateral Raise', 'Shoulders', false),
  ('Front Raise', 'Shoulders', false),
  ('Arnold Press', 'Shoulders', false),
  ('Shrug', 'Shoulders', false),

  -- Arms
  ('Barbell Curl', 'Arms', false),
  ('Dumbbell Curl', 'Arms', false),
  ('Hammer Curl', 'Arms', false),
  ('Tricep Pushdown', 'Arms', false),
  ('Skull Crusher', 'Arms', false),
  ('Overhead Tricep Extension', 'Arms', false),
  ('Dip', 'Arms', false),

  -- Core
  ('Plank', 'Core', false),
  ('Cable Crunch', 'Core', false),
  ('Hanging Leg Raise', 'Core', false),
  ('Russian Twist', 'Core', false),
  ('Ab Wheel Rollout', 'Core', false),

  -- Cardio
  ('Treadmill', 'Cardio', false),
  ('Rowing Machine', 'Cardio', false),
  ('Assault Bike', 'Cardio', false),
  ('Jump Rope', 'Cardio', false);
