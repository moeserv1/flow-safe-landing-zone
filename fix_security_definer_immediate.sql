-- IMMEDIATE FIX for SECURITY DEFINER warning
-- Run this directly in Supabase SQL Editor to fix the issue right now

-- Step 1: Drop the existing view completely (including any dependencies)
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

-- Step 2: Recreate with explicit SECURITY INVOKER
CREATE VIEW public.community_messages_with_profiles 
WITH (security_invoker = true) AS
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

-- Step 3: Grant permissions
GRANT SELECT ON public.community_messages_with_profiles TO authenticated;
GRANT SELECT ON public.community_messages_with_profiles TO anon;

-- Step 4: Verify the view is created correctly
-- You can run this query to check:
-- SELECT schemaname, viewname, viewowner, definition 
-- FROM pg_views 
-- WHERE viewname = 'community_messages_with_profiles';

-- Step 5: Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create basic RLS policies for profiles if they don't exist
DO $$
BEGIN
    -- Check if policy exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Allow authenticated users to read public profile info'
    ) THEN
        CREATE POLICY "Allow authenticated users to read public profile info" ON public.profiles
        FOR SELECT
        TO authenticated
        USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Allow users to update their own profile'
    ) THEN
        CREATE POLICY "Allow users to update their own profile" ON public.profiles
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Allow users to insert their own profile'
    ) THEN
        CREATE POLICY "Allow users to insert their own profile" ON public.profiles
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Step 7: Add comment to document the security configuration
COMMENT ON VIEW public.community_messages_with_profiles IS 
'Community messages with user profiles. Uses SECURITY INVOKER to ensure Row Level Security policies are enforced for each querying user, preventing unauthorized data access.';

-- Verification queries (uncomment to run):
-- SELECT 'View created successfully' as status;
-- SELECT viewname, definition FROM pg_views WHERE viewname = 'community_messages_with_profiles';
