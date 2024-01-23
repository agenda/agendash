import request from "services/request";

export const requeueJobs = async (ids: string[]) => {
  const res = await request().post("api/jobs/requeue", {
    jobIds: ids,
  });
  return res.data;
};
