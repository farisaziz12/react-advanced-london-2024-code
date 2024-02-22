import { useEffect, useState } from "react";
import { ChartData, FakerStructure } from "@/types";

export type DataFetcher = (args: {
  signal: AbortSignal;
  setData: (data: { data: FakerStructure[]; chartData: ChartData[] }) => void;
}) => Promise<unknown>;

export const useFetchData = (fetchData: DataFetcher) => {
  const [data, setData] = useState<{
    data: FakerStructure[];
    chartData: ChartData[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        await fetchData({ signal, setData });
      } catch (error) {
        const { name } = error as Error;

        if (name !== "AbortError") {
          // Don't set error state if fetch is aborted
          setError(error as Error);
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      abortController.abort(); // Abort fetch on component unmount
      setData(null);
      setIsLoading(false);
      setError(null);
    };
  }, []);

  return { data, isLoading, error };
};
