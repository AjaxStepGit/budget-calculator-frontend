import { PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import AddBudgetModal from "./modal/add-budget";
import { useBudgets } from "@/hooks/useBudgets";
import ConfirmDeleteDialog from "./modal/confirm-delete";
import { useDeleteBudget } from "@/hooks/useDeleteBudget";
import { useState } from "react";
import PaginationControls from "./pagination-controls";

export default function Budget() {

   const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading, isError } = useBudgets({ ordering: "-amount",
    limit: itemsPerPage,
    offset: offset, });

  const { mutate: deleteBudget, isPending } = useDeleteBudget();
  

  const formatMonth = (dateStr: string) =>
    new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(
      new Date(dateStr)
    );

  if (isLoading) return <div className="p-4">Loading budgets...</div>;
  if (isError || !data) return <div className="p-4 text-red-600">Failed to load budget data</div>;

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <Card className="flex flex-row w-full justify-between items-center rounded-xl bg-white p-4">
        <p className="text-lg font-semibold">Budget</p>
        <AddBudgetModal />
      </Card>

      {/* Table */}
      <Card className="mt-4 p-4">
        <Table>
          <TableCaption>A list of your monthly budgets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">#</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((budget, idx) => (
              <TableRow key={budget.id} className="odd:bg-muted/50">
                <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                <TableCell>{formatMonth(budget.month)}</TableCell>
                <TableCell className="text-right">₹{budget.amount}</TableCell>
                <TableCell className="text-center space-x-2">
                 
                  <ConfirmDeleteDialog 
                   onConfirm={() => deleteBudget(budget.id)}
                        disabled={isPending} 
                  />
                </TableCell>
              </TableRow>
            ))}
            {data.results.length === 0 && <div className="flex justify-center">No Budget Available</div>}
          </TableBody>
        </Table>
        <div className="mt-4">
          <PaginationControls
            totalItems={data?.count || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
}
