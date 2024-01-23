import { TimePicker as MUITimePicker } from "@mui/x-date-pickers/TimePicker";
import { getHourAndMinuteFormDate } from "utils/date-time";

interface TimePickerProps {
  onChange: (
    time: Date | null,
    { hour, minute }: { hour: number; minute: number }
  ) => void;
  value?: Date | null;
}

const TimePicker = ({ onChange, value }: TimePickerProps) => {
  const onChangeMUITimePicker = (time: Date | null) => {
    onChange(time, getHourAndMinuteFormDate(time));
  };

  return (
    <MUITimePicker
      onChange={onChangeMUITimePicker}
      className="z-[100] [&_input]:p-2"
      open={false}
      views={["hours", "minutes"]}
      value={value}
    />
  );
};

export default TimePicker;
