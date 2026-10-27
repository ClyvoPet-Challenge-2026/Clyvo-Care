import { useQuery } from "@tanstack/react-query";
import { listClinics } from "../Services/clinics";
import { queryKeys } from "../Lib/queryKeys";

export function useClinics() {
  return useQuery({ queryKey: queryKeys.clinics.all, queryFn: listClinics });
}
