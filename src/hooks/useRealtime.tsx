
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

export const useRealtime = <T extends TableName>(
  table: T,
  filter?: { column: string; value: any }
) => {
  const [data, setData] = useState<TableRow<T>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;
    let unsubscribed = false;

    const fetchInitialData = async () => {
      try {
        let query = supabase.from(table).select('*');
        if (filter) {
          query = query.eq(filter.column, filter.value);
        }
        const { data: initialData, error } = await query;
        if (error) throw error;
        setData((initialData as any) || []);
      } catch (error) {
        console.error(`Error fetching initial data from ${table}:`, error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    const setupRealtimeSubscription = () => {
      // Use random hex postfix to ensure uniqueness in edge-case re-mounts
      const channelName = `realtime:${table}:${filter?.column ?? ''}:${filter?.value ?? ''}:${Math.random().toString(16).slice(2)}`;
      channel = supabase
        .channel(channelName)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined
        }, (payload) => {
          setData(prev => [payload.new as TableRow<T>, ...prev]);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined
        }, (payload) => {
          setData(prev => prev.map(item =>
            (item as any).id === (payload.new as any).id ? payload.new as TableRow<T> : item
          ));
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: table,
          filter: filter ? `${filter.column}=eq.${filter.value}` : undefined
        }, (payload) => {
          setData(prev => prev.filter(item => (item as any).id !== (payload.old as any).id));
        })
        .subscribe();

      // No need to call subscribe() again on the same instance
    };

    fetchInitialData();
    setupRealtimeSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter?.column, filter?.value]);

  return { data, loading, setData };
};

export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.values(newState).flat();
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const trackUser = async (userInfo: any) => {
    const channel = supabase.channel('online-users');
    await channel.track(userInfo);
  };

  return { onlineUsers, trackUser };
};

