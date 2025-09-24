import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import Error from "./pages/Error";
import Loading from "./pages/Loading";
import Protected from "./pages/Protected";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import SearchPage from "./components/SearchPage";

function App() {
  const Auth = lazy(() => import("./pages/Auth"));
  const Home = lazy(() => import("./pages/Home"));
  const Root = lazy(() => import("./pages/Root"));
  const router = createBrowserRouter([
    {
      path: "/",
      id: "root",
      errorElement: <Error />,
      loader: (meta: any) =>
        import("./pages/Root").then((module) => module.loader(meta)),
      element: (
        <Suspense fallback={<Loading />}>
          <Root />
        </Suspense>
      ),
      children: [
        {
          path: "/auth",
          element: (
            <Suspense fallback>
              <Auth />
            </Suspense>
          ),
        },
        {
          element: <Protected />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<Loading />}>
                  <Home />
                </Suspense>
              ),
            },
            {
              path: "/profile",
              element:(
                <Suspense fallback={<Loading />}>
                  <Profile />
                </Suspense>
              )
            },
            {
              path: "/chat",
              element:(
                <Suspense fallback={<Loading />}>
                  <Chat />
                </Suspense>
              )
            },
            {
              path: "/search",
              element:(
                <Suspense fallback={<Loading />}>
                  <SearchPage />
                </Suspense>
              )
            }
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
