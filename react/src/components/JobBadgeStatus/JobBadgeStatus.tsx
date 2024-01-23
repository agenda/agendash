import { Flex } from "@radix-ui/themes";
import { Job } from "apis";

interface JobBadgeStatusProps {
  job: Job;
}

const JobBadgeStatus = ({ job }: JobBadgeStatusProps) => {
  return (
    <Flex gap="1" wrap="wrap">
      {job.repeating && (
        <span className="text-white p-1 rounded-sm text-xs bg-repeating">
          {job.job.repeatInterval}
        </span>
      )}
      {job.scheduled && (
        <span className="text-white p-1 rounded-sm text-xs bg-scheduled">
          Scheduled
        </span>
      )}
      {job.completed && (
        <span className="text-white p-1 rounded-sm text-xs bg-completed">
          Completed
        </span>
      )}
      {job.queued && (
        <span className="text-white p-1 rounded-sm text-xs bg-queued">
          Queued
        </span>
      )}
      {job.failed && (
        <span className="text-white p-1 rounded-sm text-xs bg-failed">
          Failed
        </span>
      )}
      {job.running && (
        <span className="text-white p-1 rounded-sm text-xs bg-running">
          Running
        </span>
      )}
    </Flex>
  );
};

export default JobBadgeStatus;
