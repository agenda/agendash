import { Box, Card, Flex, Heading, ScrollArea, Text } from "@radix-ui/themes";
import { Overview } from "apis";
import clsx from "clsx";
import ProgressBar, { ProgressBarItems } from "components/UI-kits/ProgressBar";

interface SidebarProps {
  overview: Overview[];
  isLoading: boolean;
}

const Sidebar = ({ overview }: SidebarProps) => {
  return (
    <ScrollArea
      scrollbars="vertical"
      className="min-h-[calc(100vh_-_50px)] w-[400px]"
    >
      <Box className={clsx("border-r-2 px-4 py-2")}>
        <Heading as="h2" size="5" mb="2">
          Overview
        </Heading>
        {overview.map((job, index) => {
          const progressBar: ProgressBarItems = [
            {
              value: (job.scheduled * 100) / job.total,
              color: "bg-scheduled",
            },
            {
              value: (job.queued * 100) / job.total,
              color: "bg-queued",
            },
            {
              value: (job.running * 100) / job.total,
              color: "bg-running",
            },
            {
              value: (job.completed * 100) / job.total,
              color: "bg-completed",
            },
            {
              value: (job.failed * 100) / job.total,
              color: "bg-failed",
            },
          ];
          return (
            <Card key={index} mb="2">
              <Flex justify="between">
                <Text weight="medium">{job.displayName}</Text>
                <Text weight="medium">{job.total}</Text>
              </Flex>
              <Box>
                <ProgressBar value={progressBar} className="my-2" />
              </Box>
              <Box>
                <Flex justify="between">
                  <Text weight="medium">Scheduled:</Text>
                  <Text weight="medium">{job.scheduled}</Text>
                </Flex>
                <Flex justify="between">
                  <Text color="sky" weight="medium">
                    Queued:
                  </Text>
                  <Text color="sky" weight="medium">
                    {job.queued}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Text color="yellow" weight="medium">
                    Running:
                  </Text>
                  <Text color="yellow" weight="medium">
                    {job.running}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Text color="green" weight="medium">
                    Completed:
                  </Text>
                  <Text color="green" weight="medium">
                    {job.completed}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Text color="red" weight="medium">
                    Failed:
                  </Text>
                  <Text color="red" weight="medium">
                    {job.failed}
                  </Text>
                </Flex>
                <Flex justify="between">
                  <Text color="blue" weight="medium">
                    Repeating:
                  </Text>
                  <Text color="blue" weight="medium">
                    {job.repeating}
                  </Text>
                </Flex>
              </Box>
            </Card>
          );
        })}
      </Box>
    </ScrollArea>
  );
};

export default Sidebar;
