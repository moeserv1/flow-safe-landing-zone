
-- Create view with explicit SECURITY INVOKER to ensure proper RLS enforcement
-- This prevents SECURITY DEFINER issues and ensures RLS policies are enforced
CREATE OR REPLACE VIEW public.community_messages_with_profiles
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
