export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sunday to Saturday

export const generateCronByDayInWeekAndTime = (
  dayInWeek: DayNumber,
  hour: number,
  minute: number
) => {
  return `${minute} ${hour} * * ${dayInWeek}`;
};

/**
 *
 * @param dateInMonth  From 1 to 31
 * @param hour  From 0 to 23
 * @param minute  From 0 to 59
 */
export const generateCronByDateInMonthAndTime = (
  dateInMonth: number,
  hour: number,
  minute: number
) => {
  return `${minute} ${hour} ${dateInMonth} * *`;
};

export const generateCronByEveryDay = (
  hour: number,
  minute: number
) => {
  return `${minute} ${hour} * * *`;
};

