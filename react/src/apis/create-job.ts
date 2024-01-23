import request from "services/request";

export interface CreateANewJobInput {
  jobName: string;
  jobSchedule: string;
  jobRepeatEvery: string;
  jobData: any;
}

interface CreateANewJobResponse {
  created: boolean;
}

export const createANewJob = async (input: CreateANewJobInput) => {
  const res = await request().post<CreateANewJobResponse>(
    "api/jobs/create",
    input
  );
  return res.data;
};
