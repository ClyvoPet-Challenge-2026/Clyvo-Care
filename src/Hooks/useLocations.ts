import { useQuery } from "@tanstack/react-query";
import { getStates, getCities } from "../Services/locations";
import { queryKeys } from "../Lib/queryKeys";
import { DEFAULT_STATES, DEFAULT_CITIES } from "../Data/LocationGeoData";
import type { StateApiDTO, CityApiDTO, UseLocationsOptions } from "../Types/types";

const EMPTY_STATES: StateApiDTO[] = [];
const EMPTY_CITIES: CityApiDTO[] = [];

export function useStates() {
  return useQuery({
    queryKey: queryKeys.locations.states,
    queryFn: getStates,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

export function useCities() {
  return useQuery({
    queryKey: queryKeys.locations.cities,
    queryFn: getCities,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
}

export function useLocations({ allowFallback = true }: UseLocationsOptions = {}) {
  const statesQuery = useStates();
  const citiesQuery = useCities();
  const isError = statesQuery.isError || citiesQuery.isError;
  const isFetching = statesQuery.isFetching || citiesQuery.isFetching;
  const isLoading = !isError && (statesQuery.isPending || citiesQuery.isPending);
  const isEmpty = !isLoading && !isError &&
    (!statesQuery.data?.length || !citiesQuery.data?.length);

  // Preserva o fallback legado como um catálogo único, sem misturar IDs locais
  // com dados remotos e sem armazenar dados demonstrativos no cache da API.
  const isUsingFallback = allowFallback &&
    (isError || (!isLoading && !statesQuery.data?.length));
  const hideRemoteData = isLoading || (!allowFallback && isError);

  return {
    states: isUsingFallback
      ? DEFAULT_STATES
      : hideRemoteData ? EMPTY_STATES : statesQuery.data ?? EMPTY_STATES,
    cities: isUsingFallback
      ? DEFAULT_CITIES
      : hideRemoteData ? EMPTY_CITIES : citiesQuery.data ?? EMPTY_CITIES,
    isLoading,
    isFetching,
    isEmpty,
    isError,
    error: statesQuery.error ?? citiesQuery.error,
    isUsingFallback,
    refetch: () => Promise.all([statesQuery.refetch(), citiesQuery.refetch()]),
  };
}
