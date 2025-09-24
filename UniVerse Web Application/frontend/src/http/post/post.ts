import { AuthHandler } from "../../util/auth/auth";
import { HTTPResponse } from "../http";

interface fetchPostsI {
  tags: string[];
  targetUserId?: number;
  page?: number; // Add page parameter
  limit?: number; // Add limit parameter
}
export interface User {
  user_name: string;
  user_photo: string;
}
export interface Post {
  tags: string[];
  id: number;
  user_id: number;
  user: User;
  content: string;
  title: string;
  image: string;
  created_at: string;
}
interface FetchPostResponse {
  posts: Post[];
  totalPages: number; // Add totalPages to the response
}

export async function getPosts(params: fetchPostsI) {
  let queryParams = "?";
  if (params.targetUserId !== undefined) {
    queryParams += `user_id=${params.targetUserId}&`;
  }
  if (params.page !== undefined) {
    queryParams += `page=${params.page}&`;
  }
  if (params.limit !== undefined) {
    queryParams += `limit=${params.limit}&`;
  }

  // Remove the trailing '&' if it exists
  if (queryParams.endsWith("&")) {
    queryParams = queryParams.slice(0, -1);
  }

  const result = await fetch(
    import.meta.env.VITE_BASE_URL + "/posts" + queryParams,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
      mode: "cors",
    },
  );

  if (!result.ok) {
    throw new HTTPResponse("Failed to fetch posts", result.status);
  }

  const response: FetchPostResponse = await result.json();
  return {
    posts: response.posts,
    totalPages: response.totalPages, // Return totalPages for pagination
  };
}
interface makePostsI {
  title: string;
  content: string;
  image: File | null;
  tags: string[];
}

export async function makePosts(params: makePostsI) {
  const formData = new FormData();
  console.log(params.image);
  formData.append("title", params.title);
  formData.append("content", params.content);

  if (params.tags) {
    params.tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });
  }

  if (params.image) {
    formData.append("image", params.image);
  }

  try {
    // Make the fetch request
    const result = await fetch(import.meta.env.VITE_BASE_URL + "/posts", {
      headers: {
        Authorization: await new AuthHandler().getAuthHeader(),
      },
      method: "POST",
      body: formData,
    });

    if (!result.ok) {
      throw new HTTPResponse("Failed to fetch posts", result.status);
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}

interface changePostI {
  postId: number;
  content: string;
  title: string;
  image: File | null;
  tags: string[];
}
export async function changePosts(params: changePostI) {
  const formData = new FormData();
  formData.append("title", params.title);
  formData.append("content", params.content);
  formData.append("postId", params.postId.toString());

  if (params.tags) {
    console.log(params.tags);
    for (let i = 0; i < params.tags.length; i++) {
      const tag = params.tags[i];
      formData.append(`tags[${i}]`, tag);
    }
  }

  if (params.image) {
    formData.append("image", params.image);
  }
  try {
    // Make the fetch request
    const result = await fetch(import.meta.env.VITE_BASE_URL + "/posts", {
      headers: {
        Authorization: await new AuthHandler().getAuthHeader(),
      },
      method: "PUT",
      body: formData,
    });

    if (!result.ok) {
      throw new HTTPResponse("Failed to fetch posts", result.status);
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
interface removePostI {
  postId: number;
}

export async function removePosts(params: removePostI) {
  try {
    const result = await fetch(import.meta.env.VITE_BASE_URL + "/posts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: await new AuthHandler().getAuthHeader(),
      },
      method: "DELETE",
      body: JSON.stringify(params),
    });

    if (!result.ok) {
      throw new HTTPResponse("Failed to delete posts", result.status);
    }
  } catch (error) {
    console.error("Error creating post:", error);
  }
}
