
-- Create view with explicit SECURITY INVOKER to ensure proper RLS enforcement
CREATE OR REPLACE VIEW public.community_messages_with_profiles
WITH (security_invoker = true) AS
SELECT
  cm.id,
  cm.sender_id,
  cm.message,
  cm.created_at,
  p.full_name,
  p.avatar_url
FROM
  community_messages cm
LEFT JOIN
  profiles p ON cm.sender_id = p.id;
