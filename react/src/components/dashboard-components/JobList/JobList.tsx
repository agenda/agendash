import { Job } from "apis";
import { Badge, Button, Checkbox, Flex, Table } from "@radix-ui/themes";
import {
  EyeOpenIcon,
  TrashIcon,
  CounterClockwiseClockIcon,
} from "@radix-ui/react-icons";
import { getTimeDistanceByNow } from "utils/time-format";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
}

const JobList = ({ jobs = [] }: JobListProps) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            <Checkbox />
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
        {jobs.map(
          ({
            job,
            repeating,
            scheduled,
            completed,
            queued,
            failed,
            running,
          }) => {
            return (
              <Table.Row key={job._id}>
                <Table.Cell>
                  <Checkbox />
                </Table.Cell>
                <Table.Cell>{job.name}</Table.Cell>
                <Table.Cell>{job.lastRunAt}</Table.Cell>
                <Table.Cell>{getTimeDistanceByNow(job.nextRunAt)}</Table.Cell>
                <Table.Cell>
                  {getTimeDistanceByNow(job.lastFinishedAt)}
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="1">
                    {repeating && (
                      <Badge variant="solid" color="blue">
                        {job.repeatInterval}
                      </Badge>
                    )}
                    {scheduled && (
                      <Badge variant="solid" color="orange">
                        Scheduled
                      </Badge>
                    )}
                    {completed && (
                      <Badge variant="solid" color="gold">
                        Completed
                      </Badge>
                    )}
                    {queued && (
                      <Badge variant="solid" color="sky">
                        Queued
                      </Badge>
                    )}
                    {failed && (
                      <Badge variant="solid" color="red">
                        Failed
                      </Badge>
                    )}
                    {running && (
                      <Badge variant="solid" color="green">
                        Running
                      </Badge>
                    )}
                  </Flex>
                </Table.Cell>
                <Table.Cell>{job.lockedAt}</Table.Cell>
                <Table.Cell>
                  <Flex gap="1">
                    <Button
                      className="cursor-pointer"
                      color="blue"
                      variant="surface"
                    >
                      <CounterClockwiseClockIcon />
                    </Button>
                    <Button color="green" variant="surface">
                      <EyeOpenIcon />
                    </Button>
                    <Button color="red" variant="surface">
                      <TrashIcon />
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          }
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default JobList;
