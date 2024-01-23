import { formatDistance, format } from "date-fns";

export const getTimeDistanceByNow = (date?: string | Date) => {
  if (!date) return null;
  try {
    const _date = new Date(date);
    const now = new Date();

    return formatDistance(_date, now, { addSuffix: true });
  } catch (err) {
    return null;
  }
};

export const dateTimeFormat = (date?: string | Date) => {
  if (!date) return null;
  try {
    const _date = new Date(date);
    return format(_date, "dd/MM/yyyy HH:mm a");
  } catch (error) {
    return null;
  }
};
