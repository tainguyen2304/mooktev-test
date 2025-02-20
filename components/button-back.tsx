"use client";

import { Undo2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ButtonBackProps {
  url?: string;
}

const ButtonBack = ({ url }: ButtonBackProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  };

  return (
    <Undo2
      onClick={handleBack}
      className="hover:opacity-80 hover:cursor-pointer"
    />
  );
};

export default ButtonBack;
