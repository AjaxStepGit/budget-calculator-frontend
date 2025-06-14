import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import { useAddBudget } from "@/hooks/useAddBudget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function AddBudgetModal() {
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(""); // format: "01" to "12"
  const [year, setYear] = useState("");   // format: "2025"
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useAddBudget();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!year || !month) {
      alert("Please select both month and year.");
      return;
    }

    const formattedMonth = `${year}-${month}-01`; // Final format

    mutate(
      {
        month: formattedMonth,
        amount: Number(amount),
      },
      {
        onSuccess: () => {
          setAmount("");
          setMonth("");
          setYear("");
          setOpen(false);
        },
      }
    );
  };

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Budget
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Monthly Budget</DialogTitle>
          <DialogDescription>Set a budget for a specific month.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Amount Field */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Year Field */}
          <div className="space-y-2">
            <Label>Year</Label>
            <Input
              type="number"
              placeholder="e.g. 2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          {/* Month Dropdown */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Select onValueChange={setMonth} value={month}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
