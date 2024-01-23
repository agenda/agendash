import { useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { OnChangeScheduleAndIntervalProps } from "./ScheduleAndInterval";

import { generateCronByDateInMonthAndTime } from "helpers/cron";
import { getHourAndMinuteFormDate } from "utils/date-time";
import TimePicker from "components/UI-kits/TimePicker";

interface DateInMonthProps extends OnChangeScheduleAndIntervalProps {}

const DateInMonth = ({ onChange }: DateInMonthProps) => {
  const [dateInMonth, setDateInMonth] = useState<number | null>(null);
  const [time, setTime] = useState<Date | null>(new Date());

  const onChangeDateInMonth = (dateNumber: number) => {
    setDateInMonth(dateNumber);
    const { hour, minute } = getHourAndMinuteFormDate(time);
    const cron = generateCronByDateInMonthAndTime(dateNumber, hour, minute);
    onChange({ interval: cron });
  };

  const onChangeTime = (time: Date | null, { hour, minute }: any) => {
    setTime(time);

    if (!dateInMonth) return;
    const cron = generateCronByDateInMonthAndTime(dateInMonth, hour, minute);
    onChange({ interval: cron });
  };

  return (
    <Box>
      <Flex mt="2" align="center">
        <Text as="span" size="2" mb="1" mr="2" weight="bold">
          Time:
        </Text>
        <TimePicker onChange={onChangeTime} />
      </Flex>
      <Box mt="2">
        <Text as="span" size="2" weight="bold">
          Day in month:
        </Text>
        <Flex mt="2" gap="2" wrap="wrap">
          {Array.from({ length: 31 }).map((_, index) => {
            return (
              <Box
                key={index}
                onClick={() => onChangeDateInMonth(index + 1)}
                className={clsx(
                  "w-[30px] h-[30px] rounded-md border flex items-center justify-center cursor-pointer hover:bg-blue-500 hover:text-white",
                  {
                    "bg-blue-500 text-white": dateInMonth === index + 1,
                  }
                )}
              >
                <Text as="span">{index + 1}</Text>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

export default DateInMonth;
