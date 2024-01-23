import clsx from "clsx";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-muted bg-gray-200",
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
