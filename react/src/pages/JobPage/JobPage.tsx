import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { GetDashboardInput } from "apis";
import JobList from "features/dashboard/JobList";
import { Box } from "@radix-ui/themes";

import { FilterJobSheetForm } from "features/dashboard/FilterJobSheet/FilterJobSheet";
import { useQueryDashboard } from "pages/OverviewPage/useQueryDashboard";

const JobPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<GetDashboardInput>({
    limit: 10,
    skip: 0,
  });

  const searchParamJob = searchParams.get("job") ?? undefined;
  const searchParamState = searchParams.get("state") ?? undefined;

  const input = {
    ...filters,
    job: filters?.job ?? searchParamJob,
    state: filters?.state ?? searchParamState,
    skip: (page - 1) * (filters?.limit ?? 0),
  };

  const { data, isLoading } = useQueryDashboard(input);

  const onSubmitFilter = (formFilterData: FilterJobSheetForm) => {
    setFilters({ ...filters, ...formFilterData });
    setSearchParams({});
  };
  return (
    <Box>
      <JobList
        jobs={data?.jobs ?? []}
        isLoading={isLoading}
        currentPage={page}
        totalPage={data?.totalPages ?? 0}
        onChangePage={setPage}
        onSubmitFilter={onSubmitFilter}
      />
    </Box>
  );
};

export default JobPage;
