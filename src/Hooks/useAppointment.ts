import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppointment } from "../Services/appointment";
import { queryKeys } from "../Lib/queryKeys";

export function useCreateAppointment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    retry: false,
    onSuccess: () => { void client.invalidateQueries({ queryKey: queryKeys.appointments.all }); },
  });
}
