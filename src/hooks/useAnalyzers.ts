import useSWR from 'swr';
import sdkClient from '../lib/sdk-client';

export function useAnalyzers() {
  const { data, error, isLoading, mutate } = useSWR(
    'analyzers',
    () => sdkClient.analyzers.getAnalyzers(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    analyzers: data,
    isLoading,
    error,
    refresh: mutate,
  };
}

export function useAnalyzerInfo(analyzerName: string) {
  const { data, error, isLoading } = useSWR(
    analyzerName ? ['analyzer-info', analyzerName] : null,
    () => sdkClient.analyzers.getAnalyzerInfo(analyzerName as any),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    analyzerInfo: data,
    isLoading,
    error,
  };
}
