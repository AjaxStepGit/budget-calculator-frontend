import { EditIcon } from "lucide-react";
import { Button } from "./ui/button";
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
import AddCategoryModal from "./modal/add-catgeory";
import { useCategories } from "@/hooks/useCategories";
import AddOrEditCategoryModal from "./modal/add-catgeory";
import ConfirmDeleteDialog from "./modal/confirm-delete";
import { useDeleteCategory } from "@/hooks/useDeleteCategory";
import { useState } from "react";
import PaginationControls from "./pagination-controls";

export default function Categories() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const offset = (currentPage - 1) * itemsPerPage;

  const { mutate: deleteCat, isPending } = useDeleteCategory();

  const { data, isLoading, isError } = useCategories({ ordering: "name",  limit: itemsPerPage,
    offset: offset, });

  if (isLoading) return <div className="p-4">Loading categories...</div>;
  if (isError || !data) return <div className="p-4 text-red-600">Failed to load categories.</div>;

  

  return (
    <div className="flex flex-col p-4">
      <Card className="flex flex-row w-full justify-between items-center rounded-xl bg-white p-4">
        <p className="text-lg font-semibold">Categories</p>
        <AddCategoryModal />
      </Card>

      <Card className="mt-4 p-4">
        <Table>
          <TableCaption>A list of all your categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[120px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-center">Edit/Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.results.map((cat, idx) => (
              <TableRow key={cat.id} className="odd:bg-muted/50">
                <TableCell className="text-center font-medium">{idx + 1}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={`text-sm px-2 py-1 rounded-full font-medium ${
                      cat.type === "expense"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {cat.type}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex gap-2 justify-center">
                    <AddOrEditCategoryModal
                      initialData={{
                        id: cat.id,
                        name: cat.name,
                        type: cat.type,
                      }}
                      trigger={
                        <Button size="icon" variant="ghost">
                          <EditIcon className="w-4 h-4 text-blue-600" />
                        </Button>
                      }
                    />
                    <ConfirmDeleteDialog
                        onConfirm={() => deleteCat(cat.id)}
                        disabled={isPending} 
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data.results.length === 0 && <div className="flex justify-center">No category available</div>}
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
