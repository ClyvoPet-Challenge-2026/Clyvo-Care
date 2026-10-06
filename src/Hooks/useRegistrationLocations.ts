import { useState } from "react";
import { useLocations } from "./useLocations";

export function useRegistrationLocations() {
  const locations = useLocations({ allowFallback: false });
  const [stateId, setStateId] = useState<number | null>(null);
  const [cityId, setCityId] = useState(0);

  const selectedState = locations.states.find((state) => state.id === stateId)
    ?? locations.states[0];
  const availableCities = locations.cities.filter(
    (city) => city.state?.id === selectedState?.id
  );
  const selectedCity = availableCities.find((city) => city.id === cityId)
    ?? availableCities[0];
  const isBusy = locations.isLoading || locations.isFetching;
  const isUnavailable = locations.isError || locations.isEmpty;

  return {
    states: locations.states,
    availableCities,
    selectedStateId: selectedState?.id ?? null,
    selectedCityId: selectedCity?.id ?? 0,
    currentStateName: selectedState?.name ?? "Selecione o Estado",
    currentCityName: selectedCity?.name ?? "Selecione a Cidade",
    isBusy,
    isUnavailable,
    canRegister: !isBusy && !isUnavailable && !!selectedCity,
    selectState: (id: number) => {
      setStateId(id);
      setCityId(0);
    },
    selectCity: setCityId,
    retry: locations.refetch,
  };
}
