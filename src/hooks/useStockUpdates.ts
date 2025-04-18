
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Stock } from '../types/stock';

export const useStockUpdates = () => {
  const queryClient = useQueryClient();
  const [isSubscribed, setIsSubscribed] = useState(false);

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
      const subscription = supabase
        .channel('stocks_channel')
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
        subscription.unsubscribe();
        setIsSubscribed(false);
      };
    }
  }, [queryClient]);

  return { stocks, isLoading, error };
};
