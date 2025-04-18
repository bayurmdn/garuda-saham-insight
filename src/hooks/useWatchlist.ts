
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Stock } from '../types/stock';

export const useWatchlist = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('watchlists')
        .select(`
          stock_id,
          stocks (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return data.map(item => item.stocks) as Stock[];
    },
    enabled: !!userId,
  });

  const addToWatchlist = useMutation({
    mutationFn: async (stockId: string) => {
      if (!userId) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('watchlists')
        .insert([{ user_id: userId, stock_id: stockId }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
    },
  });

  const removeFromWatchlist = useMutation({
    mutationFn: async (stockId: string) => {
      if (!userId) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', userId)
        .eq('stock_id', stockId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', userId] });
    },
  });

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
  };
};
