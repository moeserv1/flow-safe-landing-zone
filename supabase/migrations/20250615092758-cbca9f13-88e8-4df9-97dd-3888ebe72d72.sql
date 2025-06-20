
-- 1. Add a 'role' column to the profiles table to distinguish admins.
ALTER TABLE public.profiles
ADD COLUMN role TEXT DEFAULT 'user';

-- 2. Create a function to check a user's role with SECURITY INVOKER for proper RLS enforcement
-- SECURITY INVOKER ensures the function runs with the caller's permissions, not the creator's
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Only allow users to check their own role or if they have admin privileges
  IF auth.uid() != p_user_id AND NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  ) THEN
    RAISE EXCEPTION 'Access denied: You can only check your own role';
  END IF;

  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = p_user_id;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;

-- 3. Enable Row Level Security on community_messages
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for community_messages
--    - Allow any authenticated user to read messages
CREATE POLICY "Allow authenticated users to read messages" ON public.community_messages
FOR SELECT
TO authenticated
USING (true);

--    - Allow users to send messages
CREATE POLICY "Allow users to insert their own messages" ON public.community_messages
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

--    - Allow users to delete their own messages, or admins/moderators to delete any message
CREATE POLICY "Allow users to delete their own messages and admins to delete any" ON public.community_messages
FOR DELETE
TO authenticated
USING (
  auth.uid() = sender_id OR
  public.get_user_role(auth.uid()) IN ('admin', 'moderator')
);
