import { useState } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import clsx from "clsx";
import { OnChangeScheduleAndIntervalProps } from "./ScheduleAndInterval";
import { DayNumber, generateCronByDayInWeekAndTime } from "helpers/cron";
import { getHourAndMinuteFormDate } from "utils/date-time";
import TimePicker from "components/UI-kits/TimePicker";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface DayInWeekProps extends OnChangeScheduleAndIntervalProps {}

const DayInWeek = ({ onChange }: DayInWeekProps) => {
  const [day, setDay] = useState<DayNumber | null>(null);
  const [time, setTime] = useState<Date | null>(new Date());

  const onSelectDay = (dayInWeek: DayNumber) => {
    setDay(dayInWeek);
    const { hour, minute } = getHourAndMinuteFormDate(time);
    const cron = generateCronByDayInWeekAndTime(dayInWeek, hour, minute);
    onChange({
      interval: cron,
    });
  };

  const onChangeTime = (
    time: Date | null,
    { hour, minute }: { hour: number; minute: number }
  ) => {
    setTime(time);

    if (!day) return;
    const cron = generateCronByDayInWeekAndTime(day, hour, minute);
    onChange({ interval: cron });
  };

  return (
    <Box>
      <Flex mt="2" align="center">
        <Text as="span" size="2" mb="1" mr="2" weight="bold">
          Time:
        </Text>
        <TimePicker value={time} onChange={onChangeTime} />
      </Flex>
      <Box mt="2">
        <Text as="span" size="2" mb="1" weight="bold">
          Day in week:
        </Text>
        <Flex mt="2" wrap="wrap" gap="2">
          {Array.from({ length: 7 }).map((_, index) => {
            return (
              <Box
                key={index}
                onClick={() => onSelectDay(index as DayNumber)}
                className={clsx(
                  "px-2 py-1 border rounded-md cursor-pointer hover:bg-blue-500 hover:text-white",
                  { "bg-blue-500 text-white": day === index }
                )}
              >
                <Text as="span">{days[index]}</Text>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

export default DayInWeek;
