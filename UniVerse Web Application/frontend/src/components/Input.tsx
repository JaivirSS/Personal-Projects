import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { twMerge } from "tailwind-merge";

interface classNamesI {
  container?: string;
  label?: string;
  input?: string;
}

type props = {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  secondary?: boolean;
  tertiary?: boolean;
  classNames?: classNamesI;
  error?: string;
  type?: HTMLInputTypeAttribute;
};

export default function Input({
  label,
  name,
  value,
  onChange,
  classNames,
  tertiary,
  secondary,
  error,
  type,
}: props) {
  function getColorLabel(): string {
    return tertiary
      ? "tertiary-background"
      : secondary
        ? "secondary-background"
        : "primary-background";
  }
  function getColorInput(): string {
    return tertiary ? "tertiary" : secondary ? "secondary" : "primary";
  }

  return (
    <div className={twMerge("flex flex-col", classNames?.container ?? "")}>
      <label
        className={twMerge(
          "w-fit p-1 py-0 rounded-sm rounded-b-none border border-b-0",
          classNames?.label ?? "",
          getColorLabel(),
        )}
      >
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={twMerge(
          "p-2 rounded-md rounded-tl-none border",
          classNames?.input ?? "",
          getColorInput(),
        )}
      />
      {error && <label className="error">{error}</label>}
    </div>
  );
}
