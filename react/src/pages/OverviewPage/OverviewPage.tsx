import { useMemo, useState } from "react";
import { isAfter } from "date-fns";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Grid, TextFieldInput } from "@radix-ui/themes";

import JobOverviewCard from "components/JobOverviewCard";
import PageHeader from "components/PageHeading";
import JobOverviewCardSkeleton from "components/JobOverviewCard/JobOverviewCardSkeleton";

import { convertTheOverviewAndLastTimeRun } from "utils/overview";
import { useQueryDashboard } from "./useQueryDashboard";
import CreateNewJobModal from "features/dashboard/CreateNewJobModal";

const OverviewPage = () => {
  const [filters, setFilters] = useState({ name: "", sort: -1, singleJob: 0 });

  const { data, isLoading } = useQueryDashboard({});
  const overviewData = convertTheOverviewAndLastTimeRun(
    data?.overview ?? [],
    data?.jobs ?? []
  );
  const [overviewBoxData, ...theRestJobOverview] = overviewData;
  const jobNames = theRestJobOverview
    .map((job) => job.lastJob?.job.name ?? "")
    .filter((e) => !!e);

  const onSort = () => {
    setFilters({ ...filters, sort: filters.sort < 0 ? 1 : -1 });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, name: e.target.value });
  };

  const theJobOverviewAfterFilter = useMemo(() => {
    const filteredByType = theRestJobOverview.filter((job) => {
      const jobType = job.lastJob?.job.type;
      return filters.singleJob ? jobType === "single" : jobType === "normal";
    });

    const filteredByName = filteredByType.filter((job) => {
      return job.lastJob?.job.name.toLowerCase().includes(filters.name);
    });

    const sortedByFilter = filteredByName.sort((a, b) => {
      if (filters.sort > 0) {
        return isAfter(
          new Date(b.lastJob?.job.lastRunAt ?? 0),
          new Date(a.lastJob?.job.lastRunAt ?? 0)
        )
          ? 1
          : -1;
      }
      return isAfter(
        new Date(a.lastJob?.job.lastRunAt ?? 0),
        new Date(b.lastJob?.job.lastRunAt ?? 0)
      )
        ? 1
        : -1;
    });

    return sortedByFilter;
  }, [filters, theRestJobOverview]);

  return (
    <Box>
      <section>
        <PageHeader className="mb-4">Overview</PageHeader>
        <Grid columns={{ md: "4", sm: "2" }} gap="4">
          {isLoading &&
            Array.from({ length: 1 }).map((_, i) => {
              return <JobOverviewCardSkeleton key={i} />;
            })}
          {overviewBoxData && <JobOverviewCard overview={overviewBoxData} />}
        </Grid>
      </section>

      <section>
        <Flex align="center">
          <PageHeader className="mb-4 mt-4">Jobs</PageHeader>
          <Flex gap="2" ml="2">
            <Button
              onClick={() => setFilters({ ...filters, singleJob: 0 })}
              variant={filters.singleJob ? "outline" : "solid"}
            >
              Normal jobs
            </Button>
            <Button
              variant={!filters.singleJob ? "outline" : "solid"}
              onClick={() => setFilters({ ...filters, singleJob: 1 })}
            >
              Single jobs
            </Button>
          </Flex>
          <Flex gap="2" className="flex-1" justify="end">
            <TextFieldInput
              value={filters.name}
              onChange={onSearch}
              placeholder="Search job name"
            />
            <Button onClick={onSort}>
              {filters.sort === -1 ? (
                <>
                  <CaretDownIcon /> ASC
                </>
              ) : (
                <>
                  <CaretUpIcon /> DESC
                </>
              )}
            </Button>
            <CreateNewJobModal jobNames={jobNames ?? []} />
          </Flex>
        </Flex>

        <Grid columns={{ md: "4", sm: "2" }} gap="4">
          {isLoading &&
            Array.from({ length: 10 }).map((_, i) => {
              return <JobOverviewCardSkeleton key={i} />;
            })}
          {theJobOverviewAfterFilter.map((job, idx) => {
            return <JobOverviewCard key={idx} overview={job} />;
          })}
        </Grid>
      </section>
    </Box>
  );
};

export default OverviewPage;
