import { ReactNode } from "react";
import { NavLink } from "react-router";
import { twJoin } from "tailwind-merge";

interface Props {
  path: string;
  children: ReactNode;
  className?: string;
}

export default function NavButton({ path, children, className }: Props) {
  return (
    <NavLink
      to={path}
      className={(_) =>
        twJoin(
          "flex justify-center items-center text-sm cursor-pointer tertiary p-1 rounded text-center",
          className,
        )
      }
    >
      {children}
    </NavLink>
  );
}
