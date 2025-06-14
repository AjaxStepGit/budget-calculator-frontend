import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserCircleIcon, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserPopOver() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircleIcon size={28} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          <LogOutIcon className="w-4 h-4" />
          Sign Out
        </Button>
      </PopoverContent>
    </Popover>
  );
}
