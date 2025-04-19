
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Stock } from '../types/stock';

export const useStockUpdates = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const queryClient = useQueryClient();

  // Fetch initial stocks data
  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stocks')
        .select('*')
        .order('ticker');
      
      if (error) throw error;
      return data as Stock[];
    },
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!isSubscribed) {
      const channel = supabase
        .channel('stocks_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'stocks'
          },
          (payload) => {
            // Update the stocks cache with the new data
            queryClient.setQueryData(['stocks'], (old: Stock[] | undefined) => {
              if (!old) return old;
              
              if (payload.eventType === 'DELETE') {
                return old.filter(stock => stock.id !== payload.old.id);
              }
              
              const newStock = payload.new as Stock;
              return old.map(stock => 
                stock.id === newStock.id ? newStock : stock
              );
            });
          }
        )
        .subscribe();

      setIsSubscribed(true);

      return () => {
        supabase.removeChannel(channel);
        setIsSubscribed(false);
      };
    }
  }, [queryClient]);

  return { stocks, isLoading, error };
};
