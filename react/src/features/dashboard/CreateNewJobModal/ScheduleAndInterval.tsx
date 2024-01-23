import { Box, Flex, Select, Text } from "@radix-ui/themes";
import { useState } from "react";
import DayInWeek from "./DayInWeek";
import DateInMonth from "./DateInMonth";
import EveryDay from "./EveryDay";

type ScheduleAndIntervalType = "now" | "dayInWeek" | "dateInMonth" | "everyday";

export interface OnChangeScheduleAndIntervalProps {
  onChange: (value: { schedule?: string; interval?: string }) => void;
}

interface ScheduleAndIntervalProps extends OnChangeScheduleAndIntervalProps {}

const ScheduleAndInterval = ({ onChange }: ScheduleAndIntervalProps) => {
  const [type, setType] = useState<ScheduleAndIntervalType | "default">(
    "default"
  );

  const onChangeType = (type: ScheduleAndIntervalType) => {
    if (type === "now") {
      onChange({ schedule: "now", interval: "" });
    } else {
      // reset schedule and interval value before show the ui to change them in form
      onChange({ interval: "", schedule: "" });
    }

    setType(type);
  };

  return (
    <Box>
      <Flex align="center" gap="2">
        <Text as="div" size="2" mb="1" weight="bold">
          Schedule and Interval:
        </Text>

        <Select.Root
          value={type}
          onValueChange={(value: ScheduleAndIntervalType) =>
            onChangeType(value)
          }
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item
              className="hover:bg-blue-400 hover:text-white"
              value="default"
            >
              Select
            </Select.Item>
            <Select.Item
              className="hover:bg-blue-400 hover:text-white"
              value="now"
            >
              Now & not repeat
            </Select.Item>
            <Select.Item
              className="hover:bg-blue-400 hover:text-white"
              value="everyday"
            >
              EveryDay
            </Select.Item>
            <Select.Item
              className="hover:bg-blue-400 hover:text-white"
              value="dayInWeek"
            >
              One Day in every week
            </Select.Item>
            <Select.Item
              className="hover:bg-blue-400 hover:text-white"
              value="dateInMonth"
            >
              One date in every month
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      {type === "dayInWeek" && <DayInWeek onChange={onChange} />}
      {type === "everyday" && <EveryDay onChange={onChange} />}
      {type === "dateInMonth" && <DateInMonth onChange={onChange} />}
    </Box>
  );
};

export default ScheduleAndInterval;
