import { useSummary } from "@/hooks/useSummary";
import { UserCircleIcon } from "lucide-react";
import { Card } from "./ui/card";
import IncomeExpensePieChart from "./charts/IncomeExpensePieChart";
import BudgetBarChart from "./charts/BudgetBarChart";
import TransactionLineChart from "./charts/TransactionLineChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "./ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const currentDate = new Date();
  const currentMonthString = currentDate.toISOString().slice(0, 7); 
  const [budgetMonth, setBudgetMonth] = useState(currentMonthString);

   const navigate = useNavigate();
  const username = localStorage.getItem('username'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); 
    navigate('/login');
  };
  const getMonthStartEnd = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const start = `${year}-${month}-01`;
    const endDate = new Date(Number(year), Number(month), 0).getDate();
    const end = `${year}-${month}-${endDate.toString().padStart(2, "0")}`;
    return { start, end };
  };

  

  const { start, end } = getMonthStartEnd(budgetMonth);
  const { data, isLoading, isError } = useSummary(start, end);

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const year = currentDate.getFullYear();
    const month = String(i + 1).padStart(2, "0");
    const label = new Date(year, i, 1).toLocaleString("en-IN", {
      month: "long",
    });
    return { value: `${year}-${month}`, label };
  });

  if (isLoading) return <div className="p-4">Loading summary...</div>;
  if (isError || !data)
    return <div className="p-4 text-red-600">Failed to load summary data</div>;

  return (
    <div className="flex flex-col p-4">
      <Card className="flex flex-row w-full justify-between items-center rounded-xl bg-white p-4">
        <p> Hey Ajax !!</p>
        <Popover>
          <PopoverTrigger>
          <Button className="flex cursor-pointer">
          <UserCircleIcon size={32} />
          </Button>
          </PopoverTrigger>
          <PopoverContent>
          <div className="p-2">
            <p className="text-sm font-medium">Signed in as</p>
            <p className="text-sm text-muted-foreground truncate">{username}</p>
          </div>
          <Separator />
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
          </PopoverContent>
        </Popover>
        
      </Card>

      <Card className="mt-4 h-full p-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-xl font-bold text-green-600">
              ₹{data.total_income}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Expense</p>
            <p className="text-xl font-bold text-red-500">
              ₹{data.total_expense}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-xl font-bold text-blue-500">₹{data.balance}</p>
          </Card>
        </div>

        {/* Charts & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold mb-2">Income vs Expense</h2>
             <Select onValueChange={setBudgetMonth} value={budgetMonth}>
                <SelectTrigger className="w-[200px]">
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
             {data.total_income === 0 && data.total_expense === 0 ? (
                <p className="text-sm text-muted-foreground mt-4">
                No income or expense data available for this month.
                </p>
            ) : (
                <IncomeExpensePieChart
                income={data.total_income}
                expense={data.total_expense}
                />
            )}
          </Card>

          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Budget vs Expense</h2>
              <Select onValueChange={setBudgetMonth} value={budgetMonth}>
                <SelectTrigger className="w-[200px]">
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

            {data.budget ? (
              <BudgetBarChart
                budget={parseFloat(data.budget.amount)}
                expense={data.total_expense}
              />
            ) : (
              <p className="text-sm text-muted-foreground mt-4">
                No budget available for this month.
              </p>
            )}
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-2">Spending Over Time - (This Month)</h2>
            {data?.recent_transactions?.some(t => t.category_details.type === "expense") ? (
              <TransactionLineChart
                transactions={data.recent_transactions
                  .filter(t => t.category_details.type === "expense")
                  .map(t => ({
                    date: t.date,
                    amount: parseFloat(t.amount),
                  }))}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No expense data to display.</p>
            )}

          </Card>


           <Card className="p-4 h-full overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>

      {data?.recent_transactions && data?.recent_transactions?.length > 0 ? (
        <div className="w-full min-w-[500px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recent_transactions.map((t: any, idx: number) => (
                <TableRow key={idx} className="hover:bg-muted/40">
                  <TableCell>
                    {new Date(t.date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>₹{t.amount}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        t.category_details.type === "expense"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {t.category_details.type}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No transactions available.
        </p>
      )}
    </Card>
        </div>
      </Card>
    </div>
  );
}
