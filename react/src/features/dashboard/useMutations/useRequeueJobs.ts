import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requeueJobs } from "apis";
import { QUERY_DASHBOARD_KEY } from "pages/OverviewPage/useQueryDashboard";

export const useRequeueJobs = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: requeueJobs,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_DASHBOARD_KEY] });
      onSuccess?.();
    },
  });
};
