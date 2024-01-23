import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Card, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import MonacoEditor from "react-monaco-editor";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateANewJobInput, createANewJob } from "apis";
import { formatJsonString } from "utils/json-format";
import ScheduleAndInterval from "./ScheduleAndInterval";
import { useRegisterField } from "hooks/useRegisterField";
import { QUERY_DASHBOARD_KEY } from "pages/OverviewPage/useQueryDashboard";
import JobNameSelector, { JobNameSelectorProps } from "./JobNameSelector";

interface CreateNewJobModalProps
  extends Partial<Pick<JobNameSelectorProps, "jobNames">> {}

const CreateNewJobModal = ({ jobNames }: CreateNewJobModalProps) => {
  const [searchParams] = useSearchParams();
  const jobNameSearchParam = searchParams.get("job");

  const jobNameDefault =
    jobNames && jobNames?.length > 0 ? jobNames[0] : jobNameSearchParam ?? "";

  const FORM_INIT = {
    jobName: jobNameDefault,
    jobSchedule: "",
    jobRepeatEvery: "",
    jobData: '{ "name": "Your meta data goes here..." }',
  };

  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    form: formData,
    setValue,
    setValues,
    reset,
  } = useRegisterField<CreateANewJobInput>(FORM_INIT);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createANewJob,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [QUERY_DASHBOARD_KEY] });
    },
  });

  // Check the syntax format
  const isInvalidSyntax = useMemo(() => {
    try {
      JSON.parse(formData.jobData);
      return false;
    } catch (error) {
      return true;
    }
  }, [formData]);

  const isMissingForm =
    !formData.jobName && !formData.jobSchedule && !formData.jobRepeatEvery;

  const jobData = useMemo(() => {
    try {
      return formatJsonString(formData.jobData);
    } catch (error) {
      return formData.jobData;
    }
  }, [formData]);

  const onSubmit = async () => {
    await mutateAsync({ ...formData, jobData: JSON.parse(formData.jobData) });
    reset();
    setIsOpen(false);
  };

  const onOpenChange = (targetOpen: boolean) => {
    if (!targetOpen) {
      reset();
    }
    setIsOpen(targetOpen);
  };

  const onChangeScheduleAndInterval = ({ schedule = "", interval = "" }) => {
    setValues({
      jobSchedule: schedule,
      jobRepeatEvery: interval,
    });
  };

  return (
    <div>
      <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
        <Dialog.Trigger>
          <Button>Schedule Job</Button>
        </Dialog.Trigger>

        <Dialog.Content size="1">
          <Dialog.Title>Schedule Job</Dialog.Title>

          <Flex direction="column" gap="4">
            <label>
              <Text as="span" size="2" mb="1" mr="2" weight="bold">
                Job Name:
              </Text>
              {jobNames ? (
                <JobNameSelector
                  jobNames={jobNames ?? []}
                  value={formData.jobName ? formData.jobName : jobNames[0]}
                  onChange={(val) => setValue("jobName", val)}
                />
              ) : (
                <TextField.Input
                  placeholder="Enter job name"
                  disabled={!!jobNameSearchParam}
                  value={
                    formData.jobName
                      ? formData.jobName
                      : jobNameSearchParam || ""
                  }
                  onChange={(e) => setValue("jobName", e.target.value)}
                />
              )}
            </label>
            <ScheduleAndInterval onChange={onChangeScheduleAndInterval} />

            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Job Metadata
              </Text>
              {isInvalidSyntax && (
                <Text size="1" color="red">
                  Please check your job data syntax
                </Text>
              )}
              <Card>
                <MonacoEditor
                  height="300px"
                  language="json"
                  value={jobData} // default format for code editor
                  // onValidate={handleEditorValidation}
                  onChange={(value) => {
                    setValue("jobData", value);
                  }}
                  options={{
                    formatOnPaste: true,
                  }}
                />
              </Card>
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              color="gray"
            >
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isPending || isInvalidSyntax || isMissingForm}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
};

export default CreateNewJobModal;
