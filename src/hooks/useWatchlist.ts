
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Stock } from '../types/stock';

export const useWatchlist = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: watchlist, isLoading } = useQuery({
    queryKey: ['watchlist', userId],
    queryFn: async () => {
      if (!userId) return [] as Stock[];
      
      const { data, error } = await supabase
        .from('watchlists')
        .select(`
          stock_id,
          stocks (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Properly type the return value to match Stock[]
      if (!data) return [] as Stock[];
      
      // Each item in data has a nested 'stocks' object that contains a single stock
      // We need to extract these stock objects from the nested structure
      const stocks = data.map(item => item.stocks) as Stock[];
      
      // Return the stocks array
      return stocks;
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
