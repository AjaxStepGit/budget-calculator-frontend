import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "./ui/table";
import AddTransactionModal from "./modal/add-transaction";
import { useTransactions } from "@/hooks/useTransactions";
import { useDeleteTransaction } from "@/hooks/useDeleteTransaction";
import ConfirmDeleteDialog from "./modal/confirm-delete";
import PaginationControls from "./pagination-controls";
import { useState } from "react";

export default function Transaction() {


  const [currentPage, setCurrentPage] = useState(1);
  
  const itemsPerPage = 5;
  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading, isError } = useTransactions({
    ordering: "-created_at",
    limit: itemsPerPage,
    offset: offset,
  });
 

  const { mutate: deleteTxn, isPending } = useDeleteTransaction();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError) return <div className="p-4 text-red-600">Failed to fetch transactions</div>;

  const transactionData = data?.results || [];
  const totalCount = data?.count || 0;

  const formatDateTime = (dateStr: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));

  return (
    <div className="flex flex-col p-4">
      <Card className="flex flex-row w-full justify-between items-center rounded-xl bg-white p-4">
        <p className="text-lg font-semibold">Transactions</p>
        <AddTransactionModal />
      </Card>

      <Card className="mt-4 p-4">
        <Table>
          <TableCaption>A list of your recent transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">#</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData.map((txn, idx) => (
              <TableRow key={txn.id} className="odd:bg-muted/50">
                <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                <TableCell>{formatDateTime(txn.date)}</TableCell>
                <TableCell>{txn.description}</TableCell>
                <TableCell className="text-right">₹{txn.amount}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`text-sm px-2 py-1 rounded-full font-medium ${
                      txn.category === 2
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {txn.category === 2 ? "Expense" : "Income"}
                  </span>
                </TableCell>
                <TableCell className="text-center space-x-2">
                  <ConfirmDeleteDialog
                        onConfirm={() => deleteTxn(txn.id)}
                        disabled={isPending} 
                    />
                </TableCell>
              </TableRow>
            ))}
            {transactionData.length === 0 && <div className="flex justify-center">Now Transaction are available</div>}
          </TableBody>
        </Table>
        <div className="mt-4">
          <PaginationControls
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Card>
    </div>
  );
}
