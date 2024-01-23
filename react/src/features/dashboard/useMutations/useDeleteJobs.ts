import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJobs } from "apis";
import { QUERY_DASHBOARD_KEY } from "pages/OverviewPage/useQueryDashboard";

export const useDeleteJobs = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJobs,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_DASHBOARD_KEY] });
      onSuccess?.();
    },
  });
};
