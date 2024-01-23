import { ReactNode, useMemo, useState } from "react";
import { Button, Card, Dialog, Flex, Text } from "@radix-ui/themes";
import { Job } from "apis";
import MonacoEditor from "react-monaco-editor";
import { formatJsonString } from "utils/json-format";
import { dateTimeFormat } from "utils/time-format";

interface JobDetailModalProps {
  job: Job;
  children: ReactNode;
}

const JobDetailModal = ({ job, children }: JobDetailModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const jobDataFormatted = useMemo(() => {
    try {
      return formatJsonString(JSON.stringify(job.job.data));
    } catch (error) {
      return job.job.data;
    }
  }, [job]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog.Content size="1">
        <Dialog.Title>Job data</Dialog.Title>
        <Flex gap="4">
          <Text mr="2" weight="bold" as="p">
            Id:
          </Text>
          <Text as="p">{job._id}</Text>
        </Flex>
        <Flex mt="2" gap="4">
          <Text mr="2" weight="bold" as="p">
            Name:
          </Text>
          <Text as="p">{job.job.name}</Text>
        </Flex>

        <Flex mt="2" gap="4">
          <Text mr="2" weight="bold" as="p">
            Next run start:
          </Text>
          <Text as="p">{dateTimeFormat(job.job.nextRunAt)}</Text>
        </Flex>
        <Flex mt="2" gap="4">
          <Text mr="2" weight="bold" as="p">
            Last run started:
          </Text>
          <Text as="p">{dateTimeFormat(job.job.lastFinishedAt)}</Text>
        </Flex>
        <Flex mt="2" direction="column" gap="4">
          <Text mr="2" weight="bold" as="p">
            Meta data:
          </Text>
          <Card>
            <MonacoEditor
              height="300px"
              language="json"
              value={jobDataFormatted} // default format for code editor
              options={{
                formatOnPaste: true,
                readOnly: true,
              }}
            />
          </Card>
        </Flex>

        <Flex justify="end" mt="2">
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default JobDetailModal;
