import Login from "@/components/login"
import piggyBg from "../assets/background/piggy-bg.jpg"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {

     const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // or "/"
    }
  }, [navigate]);

    return <div className="flex w-screen h-screen relative">
        <img className="w-full h-full cover absolute z-1 hidden lg:block" src={piggyBg} alt="diary-bg" />
        <div className="flex flex-col relative justify-center bg-rose-300 z-2 h-full items-center w-full lg:w-1/2">
        <div className="flex block lg:hidden mb-4">
          <h1 className="uppercase font-bold text-4xl text-center text-white px-3">Calculate <span className="text-black underline-anim">Your</span> budget</h1>
        </div>
        <Login/>
        </div>
    </div>
}