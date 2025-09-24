import { Request } from "express";
import { AuthRequest, HTTPResponse, newErrorPayload } from "../../http";
import {
  fetchPostI,
  fetchPosts,
  makePostI,
  makePost,
  removePostI,
  removePost,
  changePost,
  AddFavourite,
  deleteFavourite,
  fetchFavourites
} from "../../db/queries/posts/posts";

interface editPostI {
  postId: number;
  title?: string;
  content?: string;
  image?: string;
  tags?: string[];
}

interface AddFavouriteI {
  postId: number;
}

interface AddFavouriteI {
  postId: number
}

export async function getPosts(req: Request): Promise<HTTPResponse> {
  // get some information from the db
  // with the db connection fetch the first 10 posts
  const params = req.body as fetchPostI;
  try {
    const targetUserId = parseInt(req.query.user_id as string)
    const searchQuery = req.query.q as string | undefined;
    const result = await fetchPosts({
      searchQuery: searchQuery,
      tags: params.tags,
      userId: targetUserId
    });
    return new HTTPResponse({ posts: result }, 200);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(newErrorPayload("failed to fetch posts"), 400);
  }
}

export async function createPost(req: Request): Promise<HTTPResponse> {
  // create a new entry into the database with the information inside of the request object
  const userId = (req as AuthRequest).userId;
  const params = req.body as makePostI;
  try {
    await makePost({
      userId: userId,
      title: params.title,
      content: params.content,
      image: req.file?.path,
      tags: params.tags,
    });
    return new HTTPResponse({ message: "post successfully created" }, 200);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(newErrorPayload("failed to create post"), 400);
  }
}

export async function editPost(req: Request): Promise<HTTPResponse> {
  // get a post id and edit it
  const userId = (req as AuthRequest).userId;
  const params = req.body as editPostI;

  if (!params.postId) {
    return new HTTPResponse(newErrorPayload("failed to edit post"), 400);
  }

  try {
    await changePost({
      userId: userId,
      postId: params.postId,
      title: params.title,
      content: params.content,
      image: req.file?.path,
      tags: params.tags,
    });
    return new HTTPResponse({ message: "post successfully edited" }, 200);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(newErrorPayload("failed to edit post"), 400);
  }
}

export async function deletePost(req: Request) {
  const params = req.body as removePostI;
  try {
    await removePost({
      postId: params.postId,
    });
    return new HTTPResponse({ message: "post successfully removed" }, 200);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(newErrorPayload("failed to delete post"), 400);
  }
}

export async function favouritePost(req: Request) {
  const userId = (req as AuthRequest).userId;
  const params = req.body as AddFavouriteI;

  try {
    await AddFavourite({
      userId: userId,
      postId: params.postId
    });
    return new HTTPResponse({ message: "post succesffully favourited" }, 200);
  } catch (error) {
    console.log(error)
    return new HTTPResponse(newErrorPayload("failed to favourite post"), 400);
  }
}

export async function removeFavourite(req: Request) {
  const userId = (req as AuthRequest).userId;
  const params = req.body as AddFavouriteI;

  try {
    await deleteFavourite({
      userId: userId,
      postId: params.postId
    });
    return new HTTPResponse({ message: "post removed from favourites" }, 200);
  } catch (error) {
    console.log(error)
    return new HTTPResponse(newErrorPayload("failed to remove post from favourites"), 400);
  }
}

export async function getFavourites(req: Request) {
  const userId = (req as AuthRequest).userId;
  const params = req.body as fetchPostI;
  try {
    const result = await fetchFavourites({
      tags: params.tags,
      page: params.page,
      userId: userId
    });
    return new HTTPResponse({ posts: result }, 200);
  } catch (error) {
    console.log(error);
    return new HTTPResponse(newErrorPayload("failed to fetch favourites"), 400);
  }
}