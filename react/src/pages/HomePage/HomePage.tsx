import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetDashboardInput, getDashboard } from "apis";
import JobList from "components/dashboard-components/JobList";

const HomePage = () => {
  const [filters] = useState<GetDashboardInput>({ limit: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ["get-dashboard", filters],
    queryFn: () => getDashboard(filters),
  });
  return (
    <div>
      <JobList jobs={data?.jobs ?? []} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;
