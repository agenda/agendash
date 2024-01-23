import { useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import { OnChangeScheduleAndIntervalProps } from "./ScheduleAndInterval";
import TimePicker from "components/UI-kits/TimePicker";
import { generateCronByEveryDay } from "helpers/cron";

interface DayInWeekProps extends OnChangeScheduleAndIntervalProps {}

const EveryDay = ({ onChange }: DayInWeekProps) => {
  const [time, setTime] = useState<Date | null>(new Date());

  const onChangeTime = (
      time: Date | null,
      { hour, minute }: { hour: number; minute: number }
    ) => {
      setTime(time);
      const cron = generateCronByEveryDay( hour, minute);
      onChange({ interval: cron });
    }

  return (
    <Box>
      <Flex mt="2" align="center">
        <Text as="span" size="2" mb="1" mr="2" weight="bold">
          Time:
        </Text>
        <TimePicker value={time} onChange={onChangeTime} />
      </Flex>
    </Box>
  );
};

export default EveryDay;