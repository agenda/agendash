import { Job, Overview } from "apis";
import { isAfter } from "date-fns";

export const convertTheOverviewAndLastTimeRun = (
  overview: Overview[],
  jobList: Job[]
) => {
  const combineJobListByOverviewId: Job[] = [];

  for (const item of overview) {
    const id = item?._id;
    if (!id) continue;

    const jobListHashTheSameId = jobList.filter((job) => job.job.name === id);
    const theLastTimeRunJob = jobListHashTheSameId.sort((a, b) =>
      isAfter(new Date(b.job.lastRunAt ?? 0), new Date(a.job.lastRunAt ?? 0))
        ? 1
        : -1
    )[0];
    combineJobListByOverviewId.push(theLastTimeRunJob);
  }

  return overview.map((item) => {
    if (!item?._id) return { ...item, lastJob: undefined };
    const job = combineJobListByOverviewId.find((e) => e.job.name === item._id);
    return { ...item, lastJob: job };
  });
};
