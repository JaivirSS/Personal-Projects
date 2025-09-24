import { query } from "../../db";
import { Post } from "../../models/models";

export interface fetchPostI {
  tags?: string[];
  searchQuery?: string;
  userId?: number;
  page?: number
}

export interface makePostI {
  userId: number;
  title: string;
  content: string;
  image?: string;
  tags?: string[];
}

export interface changePostI {
  userId: number;
  postId: number;
  title?: string;
  content?: string;
  image?: string;
  tags?: string[];
}

export interface removePostI {
  postId: number;
}

export interface favouritePostI {
  userId: number;
  postId: number;
}

export interface favouritePostI {
  userId: number
  postId: number
}

interface PostF {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
  tags: string[];
}

interface FetchPostResponse {
  posts: PostF[];
}

export async function fetchPosts(params: fetchPostI) {
  let result;

  // if a tag was given return posts with that tag
  if (params.tags && params.tags.length > 0) {
    const placeholders = params.tags.map((_, index) => `$${index + 1}`).join(', ');

    let queryText = `
      SELECT posts.* 
      FROM posts
      INNER JOIN tags_posts ON posts.id = tags_posts.post_id
      WHERE tags_posts.tag_id IN (${placeholders})`;

    if (params.searchQuery) {
      queryText += `
      AND (title ILIKE '%' || $${params.tags.length + 1} || '%' OR 
      content ILIKE '%' || $${params.tags.length + 1} || '%')`;
    }

    if (params.userId) {
      queryText += ` AND posts.user_id = $${params.tags.length + (params.searchQuery ? 2 : 1)}`;
    }

    queryText += `
      GROUP BY posts.id
      HAVING COUNT(DISTINCT tags_posts.tag_id) = ${params.tags.length}
    `;

    if (params.searchQuery) {
      result = await query(queryText, [...params.tags, params.searchQuery, ...(params.userId ? [params.userId] : [])]);
    } else {
      result = await query(queryText, params.tags);
    }
  } else {
    if (params.userId) {
      result = await query("SELECT posts.* FROM posts WHERE user_id = $1", [params.userId]);
    } else {
      result = await query("SELECT posts.* FROM posts"); // if no tag was provided, return all posts
    }
  }

  for (const post of result.rows) {
    const userProfile = await query(
      "SELECT username, profile_picture FROM users WHERE id = $1",
      [post.user_id],
    );
    post.user = {
      user_name: userProfile.rows[0].username,
      user_photo: userProfile.rows[0].profile_picture,
    };
    const tags = await query(
      "SELECT tag_id FROM tags_posts WHERE post_id = $1",
      [post.id],
    );
    const taglist: String[] = [];
    for (const tag of tags.rows) {
      if (!taglist.includes(tag.tag_id)) {
        taglist.push(tag.tag_id);
      }
    }
    post.tags = taglist;
  }

  const data: FetchPostResponse[] = result!.rows;
  return data;
}

export async function makePost(params: makePostI) {
  // create new entry
  const result = await query(
    "INSERT INTO posts(user_id, title, content, image) VALUES($1, $2, $3, $4) RETURNING *",
    [params.userId, params.title, params.content, params.image],
  );
  let postId = -1;
  if (result.rows.length >= 1) {
    const data: Post = result.rows[0];
    postId = data.id;
  } else {
    return;
  }

  if (params.tags) {
    for (const tag of params.tags) {
      const result1 = await query("SELECT * FROM tags WHERE id = $1", [tag]);
      if (result1.rows.length < 1) {
        await query("INSERT INTO tags(id) VALUES($1)", [tag]);
      }
      await query("INSERT INTO tags_posts(tag_id, post_id) VALUES($1, $2)", [
        tag,
        postId,
      ]);
    }
  }
}

export async function changePost(params: changePostI) {
  // edit an entry
 
  await query("UPDATE posts SET title = $1, content = $2, image = $3 WHERE user_id = $4 AND id = $5", [params.title, params.content, params.image, params.userId, params.postId])
  if (params.tags) {
    await query("DELETE FROM tags_posts WHERE post_id = $1", [params.postId])
    for (const tag of params.tags) {
      const result = await query("SELECT * FROM tags WHERE id = $1", [tag]);
      if (result.rows.length < 1) {
        await query("INSERT INTO tags(id) VALUES($1)", [tag]);
      }
      await query("INSERT INTO tags_posts(tag_id, post_id) VALUES($1, $2)", [
        tag,
        params.postId,
      ]);
    }
  }
  
}

export async function removePost(params: removePostI) {
  // delete an entry
  await query("DELETE FROM tags_posts WHERE tags_posts.post_id = $1", [
    params.postId,
  ]);
  await query("DELETE FROM posts WHERE posts.id  = $1", [params.postId]);
}

export async function AddFavourite(params: favouritePostI) {
  await query("INSERT INTO favourites(user_id, post_id) VALUES($1, $2)", [params.userId, params.postId])
}

export async function deleteFavourite(params: favouritePostI) {
  await query("DELETE FROM favourites WHERE user_id = $1 AND post_id = $2", [params.userId, params.postId])
}

export async function fetchFavourites(params: fetchPostI) {
  let result;

  const page = params.page || 1;
  const offset = (page-1) * 10;
  const postlist: PostF[] = []


  // if a tag was given return posts with that tag
  if (params.tags && params.tags.length > 0) {

    const placeholders = params.tags.map((_, index) => `$${index + 1}`).join(', ');

    let queryText = `
      SELECT posts.*
      FROM posts
      INNER JOIN favourites ON posts.id = favourites.post_id
      INNER JOIN tags_posts ON posts.id = tags_posts.post_id
      WHERE tags_posts.tag_id IN (${placeholders})
      AND favourites.user_id = ${params.userId}
      `;

    queryText += 
      `GROUP BY posts.id
      HAVING COUNT(DISTINCT tags_posts.tag_id) = ${params.tags.length}
      LIMIT 10
      OFFSET ${offset}
    `;

    result =  await query(queryText, params.tags)
    for (const post of result.rows){
      const userProfile = await query("SELECT username, profile_picture FROM users WHERE id = $1", [post.user_id])
      post.user = {
        user_name: userProfile.rows[0].username,
        user_photo: userProfile.rows[0].profile_picture
      }
      const tags = await query("SELECT tag_id FROM tags_posts WHERE post_id = $1", [post.id])
      const taglist: String[] = []
      for (const tag of tags.rows) {
        if (!taglist.includes(tag.tag_id)) {
          taglist.push(tag.tag_id)
        }
      }
      post.tags = taglist
    }
  } else {
      result = await query("SELECT posts.* FROM posts INNER JOIN favourites ON posts.id = favourites.post_id WHERE favourites.user_id = $1 LIMIT 10 OFFSET $2", [params.userId, offset])
      for (const post of result.rows) {
        const userProfile = await query("SELECT username, profile_picture FROM users WHERE id = $1", [post.user_id])
        post.user = {
          user_name: userProfile.rows[0].username,
          user_photo: userProfile.rows[0].profile_picture
        }
        const tags = await query("SELECT tag_id FROM tags_posts WHERE post_id = $1", [post.id])
        const taglist: String[] = []
        for (const tag of tags.rows) {
          if (!taglist.includes(tag.tag_id)) {
            taglist.push(tag.tag_id)
          }
        }
      post.tags = taglist
    }
  }
  const data: FetchPostResponse[] = result.rows;
  return data;
}