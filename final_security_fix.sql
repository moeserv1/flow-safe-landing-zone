-- FINAL SECURITY FIX - This should completely remove the SECURITY DEFINER warning
-- Updated with double ALTER command to ensure SECURITY INVOKER is properly set
-- Run this in your Supabase SQL Editor

-- Step 1: Check current view definition
SELECT
  'BEFORE FIX - Current view definition:' as status,
  schemaname,
  viewname,
  viewowner,
  CASE
    WHEN definition LIKE '%security_definer%' OR definition LIKE '%SECURITY DEFINER%'
    THEN 'HAS SECURITY DEFINER ❌'
    WHEN definition LIKE '%security_invoker%' OR definition LIKE '%SECURITY INVOKER%'
    THEN 'HAS SECURITY INVOKER ✓'
    ELSE 'UNCLEAR - needs explicit setting'
  END as current_security_status,
  definition
FROM pg_views
WHERE viewname = 'community_messages_with_profiles';

-- Step 2: Drop the view completely with CASCADE to remove all dependencies
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

-- Step 3: Create the view with the most explicit SECURITY INVOKER syntax
-- Using multiple approaches to ensure it works

-- Method 1: Using WITH clause
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

-- Step 4: Explicitly alter the view to ensure security_invoker is set
ALTER VIEW public.community_messages_with_profiles SET (security_invoker = true);

-- Step 5: Grant permissions
GRANT SELECT ON public.community_messages_with_profiles TO authenticated;
GRANT SELECT ON public.community_messages_with_profiles TO anon;

-- Step 6: Add comment to document the security setting
COMMENT ON VIEW public.community_messages_with_profiles IS 
'Community messages with user profiles. Explicitly configured with SECURITY INVOKER to ensure Row Level Security policies are enforced for each querying user, not the view creator.';

-- Step 7: Verify the fix worked
SELECT 
  'Verification Results:' as status,
  schemaname,
  viewname,
  CASE 
    WHEN definition LIKE '%security_invoker%' THEN 'SECURITY INVOKER CONFIRMED ✓'
    WHEN definition LIKE '%SECURITY INVOKER%' THEN 'SECURITY INVOKER CONFIRMED ✓'
    WHEN definition LIKE '%security_definer%' THEN 'STILL HAS SECURITY DEFINER ❌'
    WHEN definition LIKE '%SECURITY DEFINER%' THEN 'STILL HAS SECURITY DEFINER ❌'
    ELSE 'DEFAULT (should be INVOKER) ⚠️'
  END as security_status,
  definition
FROM pg_views 
WHERE viewname = 'community_messages_with_profiles';

-- Alternative Method (uncomment if the above doesn't work):
/*
-- Drop and recreate with different syntax
DROP VIEW IF EXISTS public.community_messages_with_profiles CASCADE;

-- Create without any security specification first
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

-- Then explicitly set security invoker
ALTER VIEW public.community_messages_with_profiles SET (security_invoker = on);
*/

-- Final verification query - run this to confirm the fix
SELECT 
  'FINAL CHECK - Security Status:' as check_type,
  viewname,
  CASE 
    WHEN definition LIKE '%security_invoker%' OR definition LIKE '%SECURITY INVOKER%' 
    THEN 'SECURE - Uses SECURITY INVOKER ✓'
    WHEN definition LIKE '%security_definer%' OR definition LIKE '%SECURITY DEFINER%'
    THEN 'INSECURE - Still uses SECURITY DEFINER ❌'
    ELSE 'DEFAULT - Should be secure but verify manually'
  END as security_status
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname = 'community_messages_with_profiles';
