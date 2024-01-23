import { Card } from "@radix-ui/themes";
import Skeleton from "components/UI-kits/Skeleton";

const JobOverviewCardSkeleton = () => {
  return (
    <Card>
      <Skeleton className="w-full h-[30px] mb-2"></Skeleton>
      <Skeleton className="w-full h-[30px] mb-2"></Skeleton>
      <Skeleton className="w-full h-[30px] mb-2"></Skeleton>
      <Skeleton className="w-full h-[30px] mb-2"></Skeleton>
      <Skeleton className="w-full h-[30px]"></Skeleton>
    </Card>
  );
};

export default JobOverviewCardSkeleton;
