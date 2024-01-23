import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Job, Overview } from "apis";
import JobBadgeStatus from "components/JobBadgeStatus";
import ProgressBar, { ProgressBarItems } from "components/UI-kits/ProgressBar";
import { createSearchParams, useNavigate } from "react-router-dom";
import { camelToFlat } from "utils/string";
import { dateTimeFormat } from "utils/time-format";

interface JobOverviewCardProps {
  overview: Overview & { lastJob?: Job };
}

const JobOverviewCard = ({ overview }: JobOverviewCardProps) => {
  const navigate = useNavigate();
  const isAllJobCard = overview.displayName === "All Jobs";
  const { lastJob } = overview;
  const goToDetailByName = () => {
    if (isAllJobCard) {
      navigate({
        pathname: "/jobs",
      });
    } else {
      navigate({
        pathname: "/jobs",
        search: createSearchParams({
          job: overview.displayName,
        }).toString(),
      });
    }
  };

  const goToDetailByState = (state: string) => {
    if (isAllJobCard) {
      navigate({
        pathname: "/jobs",
        search: createSearchParams({
          state: state,
        }).toString(),
      });
    } else {
      navigate({
        pathname: "/jobs",
        search: createSearchParams({
          job: overview.displayName,
          state: state,
        }).toString(),
      });
    }
  };

  const progressBar: ProgressBarItems = [
    {
      value: (overview.scheduled * 100) / overview.total,
      color: "bg-scheduled",
    },
    {
      value: (overview.queued * 100) / overview.total,
      color: "bg-queued",
    },
    {
      value: (overview.running * 100) / overview.total,
      color: "bg-running",
    },
    {
      value: (overview.completed * 100) / overview.total,
      color: "bg-completed",
    },
    {
      value: (overview.failed * 100) / overview.total,
      color: "bg-failed",
    },
  ];
  return (
    <Card mb="2">
      <Flex
        className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
        justify="between"
        onClick={() => goToDetailByName()}
      >
        <Text weight="medium">{camelToFlat(overview.displayName)}</Text>
        <Text weight="medium">{overview.total}</Text>
      </Flex>
      <Box>
        <ProgressBar value={progressBar} className="my-2" />
      </Box>
      <Box>
        <Flex
          className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
          onClick={() => goToDetailByState("scheduled")}
          justify="between"
        >
          <Text weight="medium">Scheduled:</Text>
          <Text weight="medium">{overview.scheduled}</Text>
        </Flex>
        <Flex
          className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
          onClick={() => goToDetailByState("queued")}
          justify="between"
        >
          <Text color="sky" weight="medium">
            Queued:
          </Text>
          <Text color="sky" weight="medium">
            {overview.queued}
          </Text>
        </Flex>
        <Flex
          className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
          onClick={() => goToDetailByState("running")}
          justify="between"
        >
          <Text color="yellow" weight="medium">
            Running:
          </Text>
          <Text color="yellow" weight="medium">
            {overview.running}
          </Text>
        </Flex>
        <Flex
          className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
          onClick={() => goToDetailByState("completed")}
          justify="between"
        >
          <Text color="green" weight="medium">
            Completed:
          </Text>
          <Text color="green" weight="medium">
            {overview.completed}
          </Text>
        </Flex>
        <Flex
          className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
          onClick={() => goToDetailByState("failed")}
          justify="between"
        >
          <Text color="red" weight="medium">
            Failed:
          </Text>
          <Text color="red" weight="medium">
            {overview.failed}
          </Text>
        </Flex>
        <Flex
          className="cursor-pointer hover:bg-slate-200 p-1 rounded-sm"
          onClick={() => goToDetailByState("repeating")}
          justify="between"
        >
          <Text color="blue" weight="medium">
            Repeating:
          </Text>
          <Text color="blue" weight="medium">
            {overview.repeating}
          </Text>
        </Flex>
      </Box>

      {/* The last run information */}
      {lastJob && (
        <Box className="mt-auto">
          <Flex justify="between" align="center" className="border-t-2">
            <Text weight="medium">Last run:</Text>
            <Text className="text-sm">
              {dateTimeFormat(lastJob.job.lastRunAt)}
            </Text>
          </Flex>
          <Flex justify="between" align="center" className="">
            <Text weight="medium">Last run status:</Text>
            <JobBadgeStatus job={lastJob} />
          </Flex>
        </Box>
      )}
    </Card>
  );
};

export default JobOverviewCard;
