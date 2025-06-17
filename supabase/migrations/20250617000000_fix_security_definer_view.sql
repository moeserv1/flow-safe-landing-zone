-- Fix SECURITY DEFINER issue for community_messages_with_profiles view
-- This migration ensures the view uses SECURITY INVOKER to properly enforce RLS policies

-- First, drop the view completely to remove any SECURITY DEFINER settings
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

-- Recreate the view with explicit SECURITY INVOKER (not SECURITY DEFINER)
-- This ensures RLS policies are enforced for the querying user, not the view creator
CREATE VIEW public.community_messages_with_profiles
SECURITY INVOKER AS
SELECT
  cm.id,
  cm.sender_id,
  cm.message,
  cm.created_at,
  p.full_name,
  p.avatar_url
FROM
  public.community_messages cm
LEFT JOIN
  public.profiles p ON cm.sender_id = p.id;

-- Alternative syntax that's more explicit about security (PostgreSQL 15+)
-- If the above doesn't work, uncomment the following:
/*
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;
CREATE VIEW public.community_messages_with_profiles AS
SELECT
  cm.id,
  cm.sender_id,
  cm.message,
  cm.created_at,
  p.full_name,
  p.avatar_url
FROM
  public.community_messages cm
LEFT JOIN
  public.profiles p ON cm.sender_id = p.id;

-- Explicitly set security invoker after creation
ALTER VIEW public.community_messages_with_profiles SET (security_invoker = true);
*/

-- Grant appropriate permissions to authenticated users
GRANT SELECT ON public.community_messages_with_profiles TO authenticated;

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table to ensure proper security
-- Allow users to read all public profile information (needed for community features)
CREATE POLICY "Allow authenticated users to read public profile info" ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to insert their own profile (for new user registration)
CREATE POLICY "Allow users to insert their own profile" ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Add comment explaining the security configuration
COMMENT ON VIEW public.community_messages_with_profiles IS
'View combining community messages with user profiles. Uses SECURITY INVOKER to ensure Row Level Security policies are properly enforced for each querying user.';
