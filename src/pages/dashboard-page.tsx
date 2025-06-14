import Budget from "@/components/budget";
import Categories from "@/components/categories";
import BudgetBarChart from "@/components/charts/BudgetBarChart";
import IncomeExpensePieChart from "@/components/charts/IncomeExpensePieChart";
import TransactionLineChart from "@/components/charts/TransactionLineChart";
import Dashboard from "@/components/dashboard";
import Transaction from "@/components/transaction";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  BadgeIndianRupee,
  ChartColumnStacked,
  CircleUserIcon,
  LayoutDashboardIcon,
  MenuIcon,
  PiggyBank,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

export default function DashboardPage() {
  const [menu, setMenu] = useState<"dashboard" | "transaction" | "categories" | "budget">("dashboard");

  const username = localStorage.getItem("username")

  const navigate = useNavigate()
  const closeBtn = document.getElementById("drawer-close-btn");


  const handleMenuClick = (item: typeof menu) => {
    setMenu(item);
    if (closeBtn) (closeBtn as HTMLButtonElement).click();
  };

 
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); 
    navigate('/login');
    if (closeBtn) (closeBtn as HTMLButtonElement).click();
  };



  return (
    <div className="flex relative flex-col lg:flex-row bg-white h-full w-full">
      <div className="flex justify-between sticky lg:hidden top-0 bg-white h-[50px] shadow-xl w-full z-10">
        <Drawer>
          <DrawerTrigger>
            <MenuIcon className="h-full ml-4" />
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col items-center gap-4 mt-8 pb-8">
              <button
                onClick={() => handleMenuClick("dashboard")}
                className="flex items-center w-full gap-3 px-6 py-2 hover:bg-rose-200"
              >
                <LayoutDashboardIcon size={24} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleMenuClick("transaction")}
                className="flex items-center w-full gap-3 px-6 py-2 hover:bg-rose-200"
              >
                <BadgeIndianRupee size={24} />
                <span>Transactions</span>
              </button>
              <button
                onClick={() => handleMenuClick("categories")}
                className="flex items-center w-full gap-3 px-6 py-2 hover:bg-rose-200"
              >
                <ChartColumnStacked size={24} />
                <span>Categories</span>
              </button>
              <button
                onClick={() => handleMenuClick("budget")}
                className="flex items-center w-full gap-3 px-6 py-2 hover:bg-rose-200"
              >
                <ChartColumnStacked size={24} />
                <span>Budget</span>
              </button>
              <button id="drawer-close-btn" className="hidden" />
            </div>
          </DrawerContent>
        </Drawer>

        <Drawer>
          <DrawerTrigger>
            <CircleUserIcon className="h-full mr-4" />
          </DrawerTrigger>
          <DrawerContent>
            <div className="flex flex-col items-center gap-4 mt-8 pb-8">
              <div className="flex items-center w-full gap-3 px-6 py-2">
                <CircleUserIcon size={24} />
                <span>{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full gap-3 px-6 py-2 hover:bg-rose-200"
              >
                <LogOut size={24} />
                <span>Logout</span>
              </button>
              <button id="profile-drawer-close-btn" className="hidden" />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Sidebar for Desktop */}
      <div className="flex flex-col shadow-lg bg-white w-[90px] h-screen sticky top-0 left-0 bottom-0 hidden lg:flex">
        <div className="flex items-center flex-col gap-1 bg-rose-300 py-4">
          <PiggyBank color="white" size={32} />
        </div>
        <div className="flex flex-col items-center gap-4 mt-32">
          <div
            onClick={() => setMenu("dashboard")}
            className="flex items-center cursor-pointer w-full flex-col gap-1 py-2 hover:bg-rose-300"
          >
            <LayoutDashboardIcon size={32} />
            <p className="text-xs">Dashboard</p>
          </div>
          <div
            onClick={() => setMenu("transaction")}
            className="flex items-center cursor-pointer w-full flex-col gap-1 py-2 hover:bg-rose-300"
          >
            <BadgeIndianRupee size={32} />
            <p className="text-xs">Transactions</p>
          </div>
          <div
            onClick={() => setMenu("categories")}
            className="flex items-center cursor-pointer w-full flex-col gap-1 py-2 hover:bg-rose-300"
          >
            <ChartColumnStacked size={32} />
            <p className="text-xs">Categories</p>
          </div>
          <div
            onClick={() => setMenu("budget")}
            className="flex items-center cursor-pointer w-full flex-col gap-1 py-2 hover:bg-rose-300"
          >
            <ChartColumnStacked size={32} />
            <p className="text-xs">Budget</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full h-screen overflow-y-auto">
        {menu === "dashboard" && <Dashboard />}
        {menu === "transaction" && <Transaction />}
        {menu === "budget" && <Budget />}
        {menu === "categories" && <Categories />}
      </div>
    </div>
  );
}