-- EXPLICIT SECURITY INVOKER FIX
-- This version uses the most explicit syntax to ensure SECURITY INVOKER (not SECURITY DEFINER)

-- Method 1: Drop and recreate with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

CREATE VIEW public.community_messages_with_profiles 
SECURITY INVOKER AS  -- This is the most explicit way to specify SECURITY INVOKER
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

-- Grant permissions
GRANT SELECT ON public.community_messages_with_profiles TO authenticated;

-- Alternative Method 2: If the above doesn't work, try this approach
-- (Uncomment if needed)
/*
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

CREATE OR REPLACE VIEW public.community_messages_with_profiles AS
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

-- Explicitly alter the view to use SECURITY INVOKER
ALTER VIEW public.community_messages_with_profiles SET (security_invoker = on);
*/

-- Verify the security setting
SELECT 
  schemaname,
  viewname,
  viewowner,
  CASE 
    WHEN definition LIKE '%security_invoker%' THEN 'SECURITY INVOKER ✓'
    WHEN definition LIKE '%SECURITY INVOKER%' THEN 'SECURITY INVOKER ✓'
    ELSE 'Check manually'
  END as security_mode
FROM pg_views 
WHERE viewname = 'community_messages_with_profiles';

-- Add documentation comment
COMMENT ON VIEW public.community_messages_with_profiles IS 
'Community messages with profiles view. Uses SECURITY INVOKER to ensure queries execute with the permissions of the querying user, not the view creator. This prevents privilege escalation and ensures Row Level Security policies are properly enforced.';
