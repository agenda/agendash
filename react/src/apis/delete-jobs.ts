import request from "services/request";

export const deleteJobs = async (jobIds: string[]) => {
  if (!jobIds.length) return;

  const res = await request().post("api/jobs/delete", { jobIds });
  return res.data;
};
