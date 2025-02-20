import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] bg-purple-800">
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "font-semibold text-[#FFEC00] drop-shadow-md text-[100px]",
            font.className
          )}
        >
          MOOVTEK
        </h1>
        <p className="text-white text-lg">
          Lộ Trình Hoàn Hảo, Hành Trình An Tâm!
        </p>
        <div>
          <LoginButton asChild mode="modal">
            <Button variant="secondary" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
