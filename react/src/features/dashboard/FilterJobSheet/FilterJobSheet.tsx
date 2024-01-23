import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "components/UI-kits/Sheet";
import { Flex, Button, TextField, Select, Checkbox } from "@radix-ui/themes";
import { useRegisterField } from "hooks/useRegisterField";
import { GetDashboardInput } from "apis";
import { useState } from "react";

const FILTER_FORM_DATA_INIT = {
  job: "",
  q: "",
  property: "",
  state: "all",
  isObjectId: false,
};

export type FilterJobSheetForm = Omit<GetDashboardInput, "limit" | "skip">;

interface FilterJobSheetProps {
  onSubmitFilter: (filters: FilterJobSheetForm) => void;
}

const FilterJobSheet = ({ onSubmitFilter }: FilterJobSheetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const { form, register, setValue, reset } =
    useRegisterField<FilterJobSheetForm>(FILTER_FORM_DATA_INIT);

  const isFilter =
    isSubmit &&
    Object.values(form).some((v) => {
      if (typeof v === "string") return v !== "";
      if (typeof v === "boolean") return v !== false;
    });

  const onSubmit = () => {
    onSubmitFilter({ ...form, state: form.state === "all" ? "" : form.state });
    setIsSubmit(true);
    setIsOpen(false);
  };

  const onClearFilter = () => {
    reset();
    onSubmitFilter({ ...FILTER_FORM_DATA_INIT, state: "" });
    setIsSubmit(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Flex gap="3">
        <SheetTrigger asChild>
          <Button color="orange">Filter</Button>
        </SheetTrigger>
        {isFilter && (
          <Button onClick={onClearFilter} color="red" variant="outline">
            Clear Filter
          </Button>
        )}
      </Flex>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
        </SheetHeader>
        <Flex direction="column" mt="5" className="">
          <label className="mb-1 font-medium">Job name</label>
          <TextField.Input placeholder="Job name" {...register("job")} />
        </Flex>
        <Flex direction="column" mt="3" className="">
          <label className="mb-1 font-medium">Property</label>
          <TextField.Input placeholder="data.color" {...register("property")} />
        </Flex>
        <Flex direction="column" mt="3" className="">
          <label className="mb-1 font-medium">Value</label>
          <TextField.Input placeholder="green" {...{ ...register("q") }} />
        </Flex>
        <Flex direction="column" mt="3" className="">
          <label className="mb-1 font-medium">State</label>
          <Select.Root
            value={form.state}
            onValueChange={(value) => setValue("state", value)}
            defaultValue="all"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="all"
              >
                All
              </Select.Item>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="scheduled"
              >
                Scheduled
              </Select.Item>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="queued"
              >
                Queued
              </Select.Item>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="running"
              >
                Running
              </Select.Item>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="completed"
              >
                Completed
              </Select.Item>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="failed"
              >
                Failed
              </Select.Item>
              <Select.Item
                className="hover:bg-blue-500 hover:text-white"
                value="repeating"
              >
                Repeating
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex mt="3" align="center" gap="2">
          <Checkbox
            checked={form.isObjectId}
            onCheckedChange={() => setValue("isObjectId", !form.isObjectId)}
            id="isObjectId"
            name="isObjectId"
          />
          <label htmlFor="isObjectId" className="mb-1 font-medium">
            Is ObjectId
          </label>
        </Flex>
        <SheetFooter className="mt-4">
          <Button onClick={onSubmit}>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default FilterJobSheet;
