import { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface TableCellProps {
  cell: any;
}

const CustomTableCell: React.FC<TableCellProps> = ({ cell }) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const cellRef = useRef<HTMLTableCellElement>(null); // Tham chiếu đến TableCell

  const content = flexRender(cell.column.columnDef.cell, cell.getContext());

  useEffect(() => {
    if (cellRef.current) {
      setIsOverflowed(
        cellRef.current.scrollWidth > cellRef.current.clientWidth
      );
    }
  }, [content]); // Kiểm tra lại nếu nội dung thay đổi

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <TableCell
            ref={cellRef}
            className="truncate max-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
          >
            {content}
          </TableCell>
        </TooltipTrigger>
        {isOverflowed && <TooltipContent>{content}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTableCell;
