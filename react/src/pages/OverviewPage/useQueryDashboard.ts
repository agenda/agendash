import { useQuery } from "@tanstack/react-query";
import { GetDashboardInput, getDashboard } from "apis";

export const QUERY_DASHBOARD_KEY = "get-dashboard";

export const useQueryDashboard = (input: GetDashboardInput) => {
  return useQuery({
    queryKey: [QUERY_DASHBOARD_KEY, input],
    queryFn: () => getDashboard(input),
    refetchInterval: 60000, // Auto-refresh every 1 minute,
  });
};
