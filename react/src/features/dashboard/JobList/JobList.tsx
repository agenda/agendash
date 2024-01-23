import { Job } from "apis";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Table,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import {
  EyeOpenIcon,
  TrashIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons";
import { dateTimeFormat, getTimeDistanceByNow } from "utils/time-format";
import Pagination from "components/UI-kits/Pagination";
import DeleteJobsModal from "features/dashboard/DeleteJobsModal";
import CreateNewJobModal from "../CreateNewJobModal";
import { useState } from "react";
import FilterJobSheet from "../FilterJobSheet";
import { FilterJobSheetForm } from "../FilterJobSheet/FilterJobSheet";
import RequeueJobsModal from "../RequeueJobsModal";
import PageHeader from "components/PageHeading";
import JobDetailModal from "../JobDetailModal/JobDetailModal";
import JobBadgeStatus from "components/JobBadgeStatus";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  currentPage: number;
  onChangePage: (page: number) => void;
  totalPage: number;
  onSubmitFilter: (filters: FilterJobSheetForm) => void;
}

const JobList = ({
  jobs = [],
  currentPage,
  totalPage,
  onChangePage,
  onSubmitFilter,
}: JobListProps) => {
  const [idsSelected, setIdsSelected] = useState<string[]>([]);

  const onSelectJob = (jobId: string | "all") => {
    // Select all jobs
    if (jobId === "all" && idsSelected.length === 0) {
      const ids = jobs.map((job) => job.job._id);

      setIdsSelected(ids);
      return;
    }

    // Unselect all
    if (jobId === "all" && idsSelected.length !== 0) {
      setIdsSelected([]);
      return;
    }

    // Select a job
    if (jobId !== "all" && idsSelected.indexOf(jobId) === -1) {
      setIdsSelected([...idsSelected, jobId]);
      return;
    }

    // Unselect a job
    if (jobId !== "all" && idsSelected.indexOf(jobId) !== -1) {
      const ids = idsSelected.filter((id) => id !== jobId);
      setIdsSelected(ids);
      return;
    }
  };

  const handlePageChange = (page: number) => {
    onChangePage(page);
    setIdsSelected([]);
  };

  const resetSelected = () => {
    setIdsSelected([]);
  };

  return (
    <Box className="w-full">
      <PageHeader className="mb-2">Job list</PageHeader>

      <Flex mb="4" justify="end" align="center" gap="3">
        <Text weight="medium" ml="2">
          Select {idsSelected.length} / 10 jobs
        </Text>
        <DeleteJobsModal
          ids={idsSelected}
          onSuccess={resetSelected}
          trigger={(props) => (
            <Button color="red" disabled={idsSelected.length === 0} {...props}>
              Multiple Delete
            </Button>
          )}
        />
        <RequeueJobsModal
          onSuccess={resetSelected}
          ids={idsSelected}
          trigger={(props) => (
            <Button color="sky" disabled={idsSelected.length === 0} {...props}>
              Multiple Requeue
            </Button>
          )}
        />
        <CreateNewJobModal />
        <FilterJobSheet onSubmitFilter={onSubmitFilter} />
      </Flex>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Checkbox
                checked={idsSelected.length === jobs.length}
                onCheckedChange={() => {
                  onSelectJob("all");
                }}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Job name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last run started</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Next run starts</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Last finished</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Locked</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {jobs.map((item) => {
            const { job } = item;
            return (
              <Table.Row key={job._id}>
                <Table.Cell>
                  <Checkbox
                    checked={idsSelected.indexOf(job._id) !== -1}
                    onCheckedChange={() => onSelectJob(job._id)}
                  />
                </Table.Cell>
                <Table.Cell>{job.name}</Table.Cell>
                <Table.Cell>{dateTimeFormat(job.lastRunAt)}</Table.Cell>
                <Table.Cell>{getTimeDistanceByNow(job.nextRunAt)}</Table.Cell>
                <Table.Cell>
                  {getTimeDistanceByNow(job.lastFinishedAt)}
                </Table.Cell>
                <Table.Cell>
                  <JobBadgeStatus job={item} />
                </Table.Cell>
                <Table.Cell>{dateTimeFormat(job.lockedAt)}</Table.Cell>
                <Table.Cell>
                  <Flex gap="2">
                    <RequeueJobsModal
                      ids={[job._id]}
                      name={job.name}
                      trigger={(props) => (
                        <Tooltip content="Requeue">
                          <IconButton
                            size="1"
                            className="cursor-pointer"
                            color="blue"
                            variant="surface"
                            {...props}
                          >
                            <CounterClockwiseClockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    />
                    <JobDetailModal job={item}>
                      <Tooltip content="Detail">
                        <IconButton
                          size="1"
                          className="cursor-pointer"
                          color="green"
                          variant="surface"
                        >
                          <EyeOpenIcon />
                        </IconButton>
                      </Tooltip>
                    </JobDetailModal>

                    <DeleteJobsModal
                      ids={[job._id]}
                      name={job.name}
                      trigger={(props) => (
                        <Tooltip content="Delete">
                          <IconButton
                            size="1"
                            className="cursor-pointer"
                            color="red"
                            variant="surface"
                            {...props}
                          >
                            <TrashIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    />
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
      <Flex mt="4" justify="end">
        <Pagination
          currentPage={currentPage}
          totalPage={totalPage}
          onChange={handlePageChange}
        />
      </Flex>
    </Box>
  );
};

export default JobList;
