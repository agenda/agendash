import { HTMLAttributes } from "react";
import { Box, Flex } from "@radix-ui/themes";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type ProgressBarItems = { color: string; value: number }[];

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: ProgressBarItems;
}

const ProgressBar = ({ value, className, ...props }: ProgressBarProps) => {
  const height = "h-[5px]";
  return (
    <Flex
      className={twMerge(
        clsx("w-full overflow-hidden bg-gray-300 rounded-full", height),
        className
      )}
      {...props}
    >
      {value.map(({ value, color }, index) => {
        return (
          <Box
            key={index}
            style={{
              width: value + "%",
            }}
            className={clsx(height, color)}
          ></Box>
        );
      })}
      <Box></Box>
    </Flex>
  );
};

export default ProgressBar;
