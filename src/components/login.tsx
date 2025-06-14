import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { username, password },
      {
        onSuccess: (data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("username", username);
          navigate("/dashboard");
          // TODO: Redirect to dashboard
        },
        onError: (error: any) => {
          alert(
            error?.response?.data?.non_field_errors?.[0] ||
              "Login failed. Please try again."
          );
        },
      }
    );
  };

  return (
    <Card className="flex flex-col rounded-xl bg-white p-4 justify-center w-2xs lg:w-md lg:translate-y-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col g-4 lg:my-16 items-center p-4"
      >
        <h1 className="text-2xl font-bold">Log in</h1>
        <Popover>
          <PopoverTrigger>
            <p className="text-xs text-gray-700 mb-8 mt-2">
            Don't have an account? <u>Sign in with our test credentials</u>
            </p>
          </PopoverTrigger>
          <PopoverContent className="bg-white p-3 -translate-y-6 rounded-xl shadow-xl border-3 border-gray-800">
            <p className="font-medium text-xs">Username: testuser</p>
            <p className="font-medium text-xs">Password: testpass123</p>
          </PopoverContent>
        </Popover>
       

        <Label className="text-xs text-gray-700">Your username</Label>
        <Input
          className="border-gray rounded-md h-8 my-2"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <Label className="text-xs text-gray-700">Your password</Label>
        <Input
          className="border-gray rounded-md h-8 my-2"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="underline text-right w-full my-4 text-xs">
          Forgot your password?
        </p>
        <Button className="w-full py-3 rounded-xl my-2" disabled={login.isPending}>
          {login.isPending ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </Card>
  );
}
