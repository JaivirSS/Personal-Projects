import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <CircularProgress />
    </div>
  );
}
