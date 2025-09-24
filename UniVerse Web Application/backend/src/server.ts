import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { deletePost, getPosts, createPost, editPost, favouritePost, removeFavourite, getFavourites } from "./api/posts/posts";
import { httpHandler, HTTPStatus } from "./http";
import { authMiddleware, refreshAccessToken } from "./api/auth/auth";
import { register, login } from "./api/auth/login";
import cors from "cors";
import http from "http";
import { setupSocket } from "./socket/socket";
import {
  createRoom,
  deleteRoom,
  getUsersFromRoomId,
  handleGetRooms,
} from "./api/message/rooms";
import { handleCreateMessage, handleGetMessages } from "./api/message/messages";

import { getUser, handleGetUsers } from "./api/users/users";
import { upload } from "./storage/storage";
import { getFriends, getFriendRequest, createFriendRequest, acceptFriendRequest, denyFriendRequest } from "./api/friends/friends";

dotenv.config();

const app = express();
const protectedRoutes = express.Router();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use("/auth", protectedRoutes);
app.use(express.urlencoded({extended: true}));

// auth
app.post("/login", async (req: Request, res: Response) => {
  await httpHandler(req, res, login);
});
app.post("/register", async (req: Request, res: Response) => {
  await httpHandler(req, res, register);
});

app.post("/refresh", async (req: Request, res: Response) => {
  await httpHandler(req, res, refreshAccessToken);
});

// posts
app.get("/posts", async (req: Request, res: Response) => {
  await httpHandler(req, res, getPosts);
});

app.post("/posts",  upload.single("image"), authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, createPost);
});

app.put("/posts",  upload.single("image"), authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, editPost);
});

app.delete("/posts", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, deletePost);
});

//
app.get("/rooms", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, handleGetRooms);
});

app.post("/rooms", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, createRoom);
});

app.delete(
  "/rooms/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    await httpHandler(req, res, deleteRoom);
  },
);

app.get(
  "/rooms/users/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    await httpHandler(req, res, getUsersFromRoomId);
  },
);

app.get(
  "/messages/:roomId",
  authMiddleware,
  async (req: Request, res: Response) => {
    await httpHandler(req, res, handleGetMessages);
  },
);
app.post("/messages", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, handleCreateMessage);
});

app.get(
  "/users/:username",
  authMiddleware,
  async (req: Request, res: Response) => {
    await httpHandler(req, res, handleGetUsers);
  },
);

app.post("/favourites", authMiddleware, async (req: Request, res: Response) =>{
  await httpHandler(req, res, favouritePost);
})

app.delete("/favourites", authMiddleware, async (req: Request, res: Response) =>{
  await httpHandler(req, res, removeFavourite);
})  

app.get("/favourites", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, getFavourites)
})


app.get("/user", authMiddleware, async (req: Request, res: Response) =>{
  await httpHandler(req, res, getUser)
})

// friends
app.get("/friends", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, getFriends);
});

app.get("/friendRequest", authMiddleware, async (req: Request, res: Response) => {
  await httpHandler(req, res, getFriendRequest);
});

app.post("/makeFriendRequest/:friendId", authMiddleware, async (req, res) => {
  await httpHandler(req, res, createFriendRequest);
});

app.put("/acceptFriendRequest/:friendRequestId", authMiddleware, async (req, res) => {
  console.log("test")
  await httpHandler(req, res, acceptFriendRequest);
});

app.delete("/denyFriendRequest/:friendRequestId", authMiddleware, async (req, res) => {
  await httpHandler(req, res, denyFriendRequest);
});


// health check
app.get("/health", (_: Request, res: Response) => {
  res.send("healthy").status(HTTPStatus.StatusOk);
});

setupSocket(server);

server.listen(port, () => {
  console.log(`Server running at localhost:${port}`);
});
