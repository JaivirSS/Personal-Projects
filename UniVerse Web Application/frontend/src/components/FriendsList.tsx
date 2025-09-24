import { ChangeEvent, useEffect, useState } from "react";
import {
  fetchFriends,
  fetchRequests,
  postFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  Friend,
  FriendRequest,
  User,
} from "../http/friends/getFriends";
import AnimatedButton from "./AnimatedButton";
import Input from "./Input";
import { getUsers } from "../http/users/users";
import { AuthHandler, Token } from "../util/auth/auth";
import { useRouteLoaderData } from "react-router";
import { twJoin } from "tailwind-merge";

export default function FriendList() {
  const [isFriendMenuOpen, setIsFriendMenuOpen] = useState(false);
  const [isRequestOpen, setRequestOpen] = useState(false);
  const [isUserOpen, setUserOpen] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const token: Token | undefined = useRouteLoaderData("root");
  const [page, setPage] = useState<number>(0);

  interface formElementI {
    value: string;
    error?: string;
  }
  interface formDataI {
    [key: string]: formElementI;
    username: formElementI;
  }
  const [form, setForm] = useState<formDataI>({
    username: { value: "" },
  });

  function handleChangeForm(event: ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name;
    const value = event.target.value ?? "";
    setForm((prev) => ({
      ...prev,
      [fieldName]: { value, error: undefined },
    }));
  }

  async function fetchF(page: number) {
    try {
      const fetchedFriends = await fetchFriends(page);
      setFriends(fetchedFriends);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch friends");
    }
  }

  useEffect(() => {
    if (isFriendMenuOpen) {
      fetchF(page);
    }
  }, [page, isFriendMenuOpen]);

  async function fetchR(page: number) {
    try {
      const fetchedRequests = await fetchRequests(page);
      setRequests(fetchedRequests);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch requests");
    }
  }

  useEffect(() => {
    if (isRequestOpen) {
      fetchR(page);
    }
  }, [page, isRequestOpen]);

  // Fetch users when the search input changes
  useEffect(() => {
    async function fetchU() {
      try {
        if (!form.username.value) {
          setUsers([]); // Clear users if input is empty
          return;
        }
        const fetchedUsers = await getUsers(form.username.value);
        setUsers(fetchedUsers); // FIX: Update users state instead of requests
      } catch (error) {
        console.log(error);
        alert("Failed to fetch users");
      }
    }
    fetchU();
  }, [form.username.value]);

  const handleMenuToggle = (menu: string) => {
    setPage(0);
    if (menu === "friend") {
      setIsFriendMenuOpen(!isFriendMenuOpen);
      setRequestOpen(false);
      setUserOpen(false);
    } else if (menu === "requests") {
      setRequestOpen(!isRequestOpen);
      setIsFriendMenuOpen(false);
      setUserOpen(false);
    } else if (menu === "search") {
      setUserOpen(!isUserOpen);
      setIsFriendMenuOpen(false);
      setRequestOpen(false);
    }
  };

  async function handleAcceptFriendRequest(id: number) {
    await acceptFriendRequest(id);
    await fetchF(page);
    await fetchR(page);
  }

  async function handleDenyFriendRequest(id: number) {
    await denyFriendRequest(id);
    await fetchF(page);
    await fetchR(page);
  }

  function incrementPage() {
    setPage((prev) => prev + 1);
  }

  function decrementPage() {
    setPage((prev) => {
      if (prev == 0) {
        return 0;
      }
      return prev - 1;
    });
  }

  // Function to close the currently open panel
  const handleClosePanel = () => {
    setIsFriendMenuOpen(false);
    setRequestOpen(false);
    setUserOpen(false);
  };

  // Check if any panel is open
  const isAnyPanelOpen = isUserOpen || isRequestOpen || isFriendMenuOpen;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 transition-all duration-300">
      <div className="flex space-x-2">
        <AnimatedButton tertiary onClick={() => handleMenuToggle("search")}>
          Users
        </AnimatedButton>
        <AnimatedButton tertiary onClick={() => handleMenuToggle("requests")}>
          Requests
        </AnimatedButton>
        <AnimatedButton tertiary onClick={() => handleMenuToggle("friend")}>
          Friends
        </AnimatedButton>
        {/* Conditionally render the X button only if any panel is open */}
        {isAnyPanelOpen && (
          <button
            onClick={handleClosePanel}
            className="ml-2 p-2 secondary rounded"
          >
            X
          </button>
        )}
      </div>

      {/* Users (Search) Panel */}
      {isUserOpen && (
        <div className="w-64 p-1 shadow-lg secondary mt-2 rounded">
          <div className="h-80 rounded-lg p-2 overflow-y-auto">
            <div className="flex justify-between items-center">
              <Input
                label="Users"
                name="username"
                type="text"
                value={form.username.value}
                onChange={handleChangeForm}
              />
            </div>
            {users.length > 0 && token ? (
              users
                .filter(
                  (user) => user.id !== AuthHandler.decodeAccessToken(token),
                )
                .map((user) => (
                  <div key={user.id} className="p-1 flex justify-between">
                    <span>{user.username}</span>{" "}
                    <button
                      className="p-1 ml-auto rounded secondary cursor-pointer"
                      onClick={() => postFriendRequest(user.id)}
                    >
                      Add Friend
                    </button>
                  </div>
                ))
            ) : (
              <div>No users found</div>
            )}
          </div>
        </div>
      )}

      {/* Requests Panel */}
      {isRequestOpen && (
        <div className="w-64 p-1 shadow-lg secondary mt-2 rounded">
          <div className="h-80 rounded-lg p-2 overflow-y-auto">
            <div className="flex justify-between items-center"></div>
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.username} className="p-1">
                  {request.username}
                  <AnimatedButton
                    className="!p-1 !m-1"
                    onClick={() => handleAcceptFriendRequest(request.id)}
                  >
                    Accept
                  </AnimatedButton>
                  <AnimatedButton
                    className="!p-1"
                    onClick={() => handleDenyFriendRequest(request.id)}
                  >
                    Deny
                  </AnimatedButton>
                </div>
              ))
            ) : (
              <div>No requests</div>
            )}
          </div>
          <div className="mt-auto flex justify-end">
            {page !== 0 && (
              <button
                onClick={decrementPage}
                className="rounded-l secondary p-2"
              >
                {" "}
                Prev{" "}
              </button>
            )}
            {users.length >= 10 && (
              <button
                onClick={incrementPage}
                className={twJoin(
                  page == 0 ? "rounded" : "rounded-r",
                  "secondary p-2",
                )}
              >
                {" "}
                Next{" "}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Friends Panel */}
      {isFriendMenuOpen && (
        <div className="w-64 p-1 shadow-lg secondary mt-2 rounded">
          <div className="h-80 rounded-lg p-2 overflow-auto">
            <div className="flex justify-between items-center"></div>
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend.username}>{friend.username}</div>
              ))
            ) : (
              <div>No friends</div>
            )}
          </div>
          <div className="mt-auto flex justify-end">
            {page !== 0 && (
              <button
                onClick={decrementPage}
                className="rounded-l secondary p-2"
              >
                {" "}
                Prev{" "}
              </button>
            )}
            {users.length >= 10 && (
              <button
                onClick={incrementPage}
                className={twJoin(
                  page == 0 ? "rounded" : "rounded-r",
                  "secondary p-2",
                )}
              >
                {" "}
                Next{" "}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

