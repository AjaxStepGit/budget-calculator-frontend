import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { PlusIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useAddCategory } from "@/hooks/useAddCategory";
import { useEditCategory } from "@/hooks/useEditCategory";

interface Category {
  id?: number;
  name: string;
  type: "income" | "expense";
}

interface Props {
  initialData?: Category;
  trigger?: React.ReactNode;
}

export default function AddOrEditCategoryModal({ initialData, trigger }: Props) {
  const isEditMode = !!initialData;

  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState<"income" | "expense" | "">(
    initialData?.type || ""
  );
  const [open, setOpen] = useState(false);

  const { mutate: addCategory, isPending: adding } = useAddCategory();
  const { mutate: editCategory, isPending: editing } = useEditCategory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type) return;

    const payload = { name, type };

    if (isEditMode && initialData?.id) {
      editCategory(
        { id: initialData.id, ...payload },
        { onSuccess: () => closeAndReset() }
      );
    } else {
      addCategory(payload, { onSuccess: () => closeAndReset() });
    }
  };

  const closeAndReset = () => {
    setOpen(false);
    setName("");
    setType("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit" : "Add"} Category</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modify the category name or type."
              : "Enter the category name and select its type."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              placeholder="e.g. Salary, Food"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={type}
              onValueChange={(val) => setType(val as "income" | "expense")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={closeAndReset}>
              Cancel
            </Button>
            <Button type="submit" disabled={adding || editing}>
              {isEditMode
                ? editing
                  ? "Updating..."
                  : "Update"
                : adding
                ? "Saving..."
                : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
