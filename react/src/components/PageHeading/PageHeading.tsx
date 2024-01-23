import { ReactNode } from "react";
import { Heading } from "@radix-ui/themes";

interface PageHeaderProps {
  children: ReactNode;
  className?: string;
}
const PageHeading = ({ children, className }: PageHeaderProps) => {
  return (
    <Heading as="h2" size="5" className={className}>
      {children}
      {}
    </Heading>
  );
};

export default PageHeading;
