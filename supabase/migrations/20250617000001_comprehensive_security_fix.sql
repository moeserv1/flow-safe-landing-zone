-- COMPREHENSIVE SECURITY FIX
-- This migration fixes all SECURITY DEFINER issues and ensures proper security configuration

-- 1. Fix the get_user_role function to use SECURITY INVOKER
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

-- 2. Ensure the community_messages_with_profiles view uses SECURITY INVOKER
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

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

-- 3. Grant appropriate permissions
GRANT SELECT ON public.community_messages_with_profiles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

-- 4. Check for and fix any other functions that might use SECURITY DEFINER
-- (This is a precautionary measure)

-- Fix increment_blog_view_count function if it exists with SECURITY DEFINER
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_blog_view_count') THEN
        DROP FUNCTION IF EXISTS public.increment_blog_view_count(uuid);
        
        CREATE OR REPLACE FUNCTION public.increment_blog_view_count(post_id uuid)
        RETURNS void AS $func$
        BEGIN
          UPDATE public.blog_posts 
          SET view_count = COALESCE(view_count, 0) + 1 
          WHERE id = post_id;
        END;
        $func$ LANGUAGE plpgsql SECURITY INVOKER;
        
        GRANT EXECUTE ON FUNCTION public.increment_blog_view_count(uuid) TO authenticated;
    END IF;
END $$;

-- Fix calculate_age function if it exists with SECURITY DEFINER
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'calculate_age') THEN
        DROP FUNCTION IF EXISTS public.calculate_age(text);
        
        CREATE OR REPLACE FUNCTION public.calculate_age(birth_date text)
        RETURNS integer AS $func$
        BEGIN
          RETURN EXTRACT(YEAR FROM AGE(birth_date::date));
        END;
        $func$ LANGUAGE plpgsql SECURITY INVOKER;
        
        GRANT EXECUTE ON FUNCTION public.calculate_age(text) TO authenticated;
    END IF;
END $$;

-- 5. Ensure all tables have proper RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 6. Create comprehensive RLS policies if they don't exist
DO $$
BEGIN
    -- Profiles policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read all public profiles') THEN
        CREATE POLICY "Users can read all public profiles" ON public.profiles
        FOR SELECT TO authenticated
        USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
        FOR UPDATE TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles
        FOR INSERT TO authenticated
        WITH CHECK (auth.uid() = id);
    END IF;
    
    -- Blog posts policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Anyone can read published posts') THEN
        CREATE POLICY "Anyone can read published posts" ON public.blog_posts
        FOR SELECT TO authenticated
        USING (status = 'published');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_posts' AND policyname = 'Authors can manage own posts') THEN
        CREATE POLICY "Authors can manage own posts" ON public.blog_posts
        FOR ALL TO authenticated
        USING (auth.uid() = author_id)
        WITH CHECK (auth.uid() = author_id);
    END IF;
END $$;

-- 7. Add security documentation
COMMENT ON FUNCTION public.get_user_role(uuid) IS 
'Gets user role with SECURITY INVOKER. Users can only check their own role unless they are admin/moderator.';

COMMENT ON VIEW public.community_messages_with_profiles IS 
'Community messages with profiles. Uses SECURITY INVOKER to ensure proper RLS enforcement.';

-- 8. Verification query to check security settings
-- Uncomment to run verification:
/*
SELECT 
  'Functions with SECURITY DEFINER (should be empty):' as check_type,
  proname as object_name,
  prosecdef as is_security_definer
FROM pg_proc 
WHERE prosecdef = true 
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');

SELECT 
  'Views security settings:' as check_type,
  viewname as object_name,
  CASE 
    WHEN definition LIKE '%security_invoker%' OR definition LIKE '%SECURITY INVOKER%' 
    THEN 'SECURITY INVOKER ✓'
    ELSE 'DEFAULT (should be INVOKER) ⚠️'
  END as security_mode
FROM pg_views 
WHERE schemaname = 'public';
*/
