export const getHourAndMinuteFormDate = (date: Date | string | null) => {
  try {
    if (!date) return { hour: 0, minute: 0 };
    const _date = new Date(date);

    const hour = new Date(_date).getHours();
    const minute = new Date(_date).getMinutes();
    return {
      hour: isNaN(hour) ? 0 : hour,
      minute: isNaN(minute) ? 0 : minute,
    };
  } catch (error) {
    return { hour: 0, minute: 0 };
  }
};
