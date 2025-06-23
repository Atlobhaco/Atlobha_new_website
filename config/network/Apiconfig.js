import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { axiosInstance } from "./AxiosConfig";

const useCustomQuery = (options) => {
  const {
    name,
    method = "get",
    body,
    query,
    url,
    baseURL,
    headers = {},
    cacheTime = 30000,
    enabled = true,
    initialData,
    initialDataUpdatedAt,
    isDataEqual,
    keepPreviousData,
    meta,
    notifyOnChangeProps,
    notifyOnChangePropsExclusions,
    onError,
    onSettled,
    onSuccess,
    queryKeyHashFn,
    refetchInterval,
    refetchIntervalInBackground,
    refetchOnMount,
    refetchOnReconnect,
    refetchOnWindowFocus,
    retry = 1,
    retryOnMount,
    retryDelay,
    select,
    staleTime = 30000,
    structuralSharing,
    suspense,
    useErrorBoundary,
    isFetching,
    isLoading,
    isStale,
  } = options;

  const { locale } = useRouter();

  // Prepare headers for FormData and other requests
  const preparedHeaders = {
    "Accept-Language": locale,
    ...(typeof window !== "undefined" && localStorage?.getItem("access_token")
      ? {
          Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
        }
      : {}),
    ...headers,
  };

  // Add Content-Type multipart/form-data if FormData is detected
  if (body instanceof FormData && !headers["Content-Type"]) {
    preparedHeaders["Content-Type"] = "multipart/form-data";
  }

  return useQuery(
    name,
    () =>
      axiosInstance({
        url,
        data: body,
        method,
        headers: preparedHeaders,
        params: query,
        baseURL,
      }),
    {
      isFetching,
      isLoading,
      cacheTime,
      enabled,
      initialData,
      initialDataUpdatedAt,
      isDataEqual,
      keepPreviousData,
      meta,
      notifyOnChangeProps,
      notifyOnChangePropsExclusions,
      onError,
      onSettled,
      onSuccess,
      queryKeyHashFn,
      refetchInterval,
      refetchIntervalInBackground,
      refetchOnMount,
      refetchOnReconnect,
      refetchOnWindowFocus,
      retry,
      retryOnMount,
      retryDelay,
      select,
      staleTime,
      structuralSharing,
      suspense,
      useErrorBoundary,
      isStale,
    }
  );
};

export default useCustomQuery;
