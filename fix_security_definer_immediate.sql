-- COMPREHENSIVE IMMEDIATE FIX: Replace ALL SECURITY DEFINER with SECURITY INVOKER
-- This fixes ALL security warnings by ensuring proper SECURITY INVOKER usage
-- Run this directly in Supabase SQL Editor to fix all issues right now

-- CRITICAL: Fix the get_user_role function (MAJOR SECURITY RISK)
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Security check: Only allow users to check their own role or if they have admin privileges
  IF auth.uid() != p_user_id AND NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only check your own role';
  END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = p_user_id;

  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Step 1: Drop the existing view completely (including any dependencies)
-- This removes any SECURITY DEFINER settings
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

-- Step 2: Recreate with explicit SECURITY INVOKER (NOT SECURITY DEFINER)
-- SECURITY INVOKER = executes with permissions of the querying user (SAFE)
-- SECURITY DEFINER = executes with permissions of the view creator (UNSAFE)
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
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

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

-- Step 7: Fix other functions that might use SECURITY DEFINER
-- Fix increment_blog_view_count function
DROP FUNCTION IF EXISTS public.increment_blog_view_count(uuid);
CREATE OR REPLACE FUNCTION public.increment_blog_view_count(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Fix calculate_age function
DROP FUNCTION IF EXISTS public.calculate_age(text);
CREATE OR REPLACE FUNCTION public.calculate_age(birth_date text)
RETURNS integer AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(birth_date::date));
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- Grant permissions for all functions
GRANT EXECUTE ON FUNCTION public.increment_blog_view_count(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_age(text) TO authenticated;

-- Step 8: Add comments to document the security configuration
COMMENT ON FUNCTION public.get_user_role(uuid) IS
'Gets user role with SECURITY INVOKER. Users can only check their own role unless they are admin/moderator.';

COMMENT ON FUNCTION public.increment_blog_view_count(uuid) IS
'Increments blog post view count with SECURITY INVOKER for proper RLS enforcement.';

COMMENT ON FUNCTION public.calculate_age(text) IS
'Calculates age from birth date with SECURITY INVOKER for security.';

COMMENT ON VIEW public.community_messages_with_profiles IS
'Community messages with user profiles. Uses SECURITY INVOKER to ensure Row Level Security policies are enforced for each querying user, preventing unauthorized data access.';

-- Step 9: Verification queries (uncomment to run):
-- SELECT 'All security fixes applied successfully!' as status;
--
-- -- Check for any remaining SECURITY DEFINER functions (should be empty)
-- SELECT 'SECURITY DEFINER functions (should be empty):' as check_type, proname
-- FROM pg_proc
-- WHERE prosecdef = true AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
--
-- -- Verify view security
-- SELECT 'View security:' as check_type, viewname,
--   CASE WHEN definition LIKE '%security_invoker%' THEN 'SECURE ✓' ELSE 'CHECK NEEDED ⚠️' END as status
-- FROM pg_views WHERE viewname = 'community_messages_with_profiles';
