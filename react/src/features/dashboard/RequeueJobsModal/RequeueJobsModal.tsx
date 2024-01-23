import { HTMLAttributes, ReactNode, useState } from "react";
import { AlertDialog, Button, Flex, Text } from "@radix-ui/themes";
import { useRequeueJobs } from "../useMutations/useRequeueJobs";

interface RequeueJobsModalProps {
  trigger: (props: any) => ReactNode;
  ids: string[];
  name?: string;
  onSuccess?: () => void;
}

const RequeueJobsModal = ({
  ids,
  name,
  trigger,
  onSuccess,
}: RequeueJobsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useRequeueJobs(onSuccess);

  const onOpenChange = (targetOpen: boolean) => {
    // Avoid close the modal when sending the request
    if (!targetOpen && isPending) {
      return;
    }

    setIsOpen(targetOpen);
  };

  const onRequeue = async () => {
    try {
      await mutateAsync(ids);

      setIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const triggerProps: HTMLAttributes<any> = {
    onClick: () => {
      setIsOpen(true);
    },
  };
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      {trigger?.(triggerProps)}
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>Confirm Requeue</AlertDialog.Title>
        {ids.map((id) => {
          return (
            <Text as="p" key={id}>
              ID: {id}
            </Text>
          );
        })}
        {name && <Text>Name:{name}</Text>}

        <Flex gap="3" mt="4" justify="end">
          <Button
            disabled={isPending}
            onClick={() => setIsOpen(false)}
            variant="soft"
            color="gray"
          >
            Cancel
          </Button>

          <Button
            disabled={isPending}
            variant="solid"
            color="sky"
            onClick={onRequeue}
          >
            Requeue
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default RequeueJobsModal;
