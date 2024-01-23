import React from "react";
import { Select } from "@radix-ui/themes";

export interface JobNameSelectorProps {
  jobNames: string[];
  value: string;
  onChange: (val: string) => void;
}

const JobNameSelector = ({
  jobNames,
  onChange,
  value,
}: JobNameSelectorProps) => {
  return (
    <Select.Root
      disabled={jobNames.length <= 1}
      value={value}
      onValueChange={(value) => onChange(value)}
    >
      <Select.Trigger />
      <Select.Content>
        {jobNames.map((job) => {
          return (
            <Select.Item
              key={job}
              className="hover:bg-blue-400 hover:text-white"
              value={job}
            >
              {job}
            </Select.Item>
          );
        })}
      </Select.Content>
    </Select.Root>
  );
};

export default JobNameSelector;
