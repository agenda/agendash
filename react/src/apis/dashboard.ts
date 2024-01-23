import request from "../services/request";

export interface GetDashboardInput {
  limit?: number;
  skip?: number;
  job?: string;
  property?: string;
  state?: string;
  q?: string;
  isObjectId?: boolean;
}

interface Meta {
  type: "normal";
  priority: 0;
  repeatInterval: "13e12";
  repeatTimezone: null;
}

export interface Overview {
  _id: string;
  displayName: string;
  meta: Meta[];
  total: number;
  running: number;
  scheduled: number;
  queued: number;
  completed: number;
  failed: number;
  repeating: number;
}

export interface Job {
  job: {
    _id: string;
    name: string;
    data: any; // data json
    priority: number;
    shouldSaveResult: boolean;
    nextRunAt: string;
    repeatAt: string;
    repeatInterval: string;
    repeatTimezone?: any;
    startDate?: string;
    endDate?: null;
    skipDays?: any;
    lastModifiedBy?: string;
    lastRunAt?: string;
    lastFinishedAt?: string;
    lockedAt?: string;
    type: "single" | "normal";
  };
  _id: string;
  running: boolean;
  scheduled: boolean;
  queued: boolean;
  completed: boolean;
  failed: boolean;
  repeating: boolean;
}

interface DashBoardResponse {
  overview: Overview[];
  jobs: Job[];
  totalPages: number;
  title: string;
  currentRequest: {
    title: string;
    job: string;
  };
}

export const getDashboard = async (
  input: GetDashboardInput
): Promise<DashBoardResponse> => {
  const res = await request().get<DashBoardResponse>("api", {
    params: input,
  });
  console.log("🚀 ~ res ~ res:", res);
  return res.data;
};
