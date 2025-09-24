import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
export default function NavButtonAction({
  children,
  className,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex justify-center items-center text-sm cursor-pointer p-1 rounded text-center",
        className,
      )}
    >
      {children}
    </button>
  );
}
