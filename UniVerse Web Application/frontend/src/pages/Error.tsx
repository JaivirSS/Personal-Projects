import { Link, useRouteError } from "react-router";

export default function Error() {
  const error: any = useRouteError();
  console.log(error);
  return (
    <div className="m-auto gap-3 text-center flex flex-col items-center justify-center h-full w-full">
      <p className="font-bold text-3xl">Oops!</p>
      <p className="font-semibold text-2xl">Something went wrong!</p>
      <p className="italic">{error.statusText}</p>
      <Link to={"/"}>
        <button className={""}>Return Home</button>
      </Link>
    </div>
  );
}
