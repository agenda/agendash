import { Button, Flex, IconButton } from "@radix-ui/themes";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

interface PaginationProps {
  currentPage: number;
  onChange: (page: number) => void;
  totalPage: number;
}

const Pagination = ({ currentPage, onChange, totalPage }: PaginationProps) => {
  return (
    <Flex gap="1">
      <IconButton
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        <ArrowLeftIcon />
      </IconButton>
      <Button>
        {currentPage}/{totalPage} page
      </Button>
      <IconButton
        disabled={currentPage === totalPage}
        onClick={() => onChange(currentPage + 1)}
      >
        <ArrowRightIcon />
      </IconButton>
    </Flex>
  );
};

export default Pagination;
