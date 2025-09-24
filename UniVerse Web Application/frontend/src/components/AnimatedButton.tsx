import { ReactNode } from "react";
import { motion } from "motion/react";
import { twJoin } from "tailwind-merge";
import { CircularProgress } from "@mui/material";

interface Props {
  children: ReactNode;
  secondary?: boolean;
  tertiary?: boolean;
  border?: boolean;
  className?: string;
  type?: "reset" | "button" | "submit";
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  loading?: boolean;
}
export default function AnimatedButton({
  children,
  secondary,
  tertiary,
  className,
  border,
  type,
  onClick,
  loading,
}: Props) {
  return (
    <motion.button
      className={twJoin(
        "w-fit h-fit p-2 rounded shadow-sm hover:shadow-md cursor-pointer",
        tertiary ? "tertiary" : "",
        secondary ? "secondary" : "primary",
        border ? "border" : "",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
    >
      <div className="flex flex-row items-center">
        {children}
        {loading && <CircularProgress size={20} className="ml-3" />}
      </div>
    </motion.button>
  );
}
