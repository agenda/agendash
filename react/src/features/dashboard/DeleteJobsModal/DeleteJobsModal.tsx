import { HTMLAttributes, ReactNode, useState } from "react";
import { AlertDialog, Box, Button, Flex, Text } from "@radix-ui/themes";
import { useDeleteJobs } from "../useMutations/useDeleteJobs";

interface DeleteJobModalProps {
  trigger: (props: any) => ReactNode;
  ids: string[];
  name?: string;
  onSuccess?: () => void;
}

const DeleteJobsModal = ({
  trigger,
  ids,
  name,
  onSuccess,
}: DeleteJobModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync, isPending } = useDeleteJobs(onSuccess);

  const onOpenChange = (targetOpen: boolean) => {
    // Avoid close the modal when sending the request
    if (!targetOpen && isPending) {
      return;
    }

    setIsOpen(targetOpen);
  };

  const onDelete = async () => {
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
        <AlertDialog.Title>Confirm Delete Permanently</AlertDialog.Title>

        {ids.map((id) => {
          return (
            <Text as="p" key={id} size="3">
              ID:{id}
            </Text>
          );
        })}
        {name && (
          <Box>
            <Text size="3" weight="bold">
              Name:
            </Text>
            {name}
          </Box>
        )}

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
            color="red"
            onClick={onDelete}
          >
            Delete
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default DeleteJobsModal;
