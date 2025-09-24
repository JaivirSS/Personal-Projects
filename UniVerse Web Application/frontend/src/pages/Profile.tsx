import { useState, useEffect, useRef } from "react";
import {
  makePosts,
  changePosts,
  removePosts,
  getPosts,
} from "../http/post/post";
import AnimatedButton from "../components/AnimatedButton";
import { useNavigate, useRouteLoaderData } from "react-router";
import { User } from "../models/models";
import { getUser } from "../http/users/users";
import { AuthHandler, Token } from "../util/auth/auth";

export default function Profile() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [user, setUser] = useState<User | undefined>();
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const token: Token | undefined = useRouteLoaderData("root");

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFunction() {
      await fetchPosts();
      const fetchedUser = await getUser();
      setUser(fetchedUser);
    }
    fetchFunction();
  }, []);

  useEffect(() => {
    if (contentTextareaRef.current) {
      contentTextareaRef.current.style.height = "auto";
      contentTextareaRef.current.style.height = `${contentTextareaRef.current.scrollHeight}px`;
    }
  }, [editingContent]);

  const fetchPosts = async () => {
    try {
      if (token) {
        const data = await getPosts({
          tags: [],
          targetUserId: AuthHandler.decodeAccessToken(token),
        });
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const handleMakePost = async () => {
    try {
      await makePosts({
        content: content,
        tags: tags,
        image: image,
        title: title,
      });
      fetchPosts();
      setContent("");
      setTitle("");
      setTags([]);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleChangePost = async (id: number) => {
    try {
      await changePosts({
        postId: id,
        content: editingContent,
        tags: editingTags,
        image: editingImage, // Pass the new image file
        title: editingTitle,
      });
      fetchPosts();
      setEditingPostId(null);
      setEditingImage(null); // Reset the editing image state
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleRemovePost = async (id: number) => {
    try {
      await removePosts({ postId: id });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const startEditingPost = (post: any) => {
    setEditingPostId(post.id);
    setEditingContent(post.content);
    setEditingTitle(post.title);
    setEditingTags(post.tags || []);
    setEditingImage(null); // Reset the editing image state when starting to edit
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setTags(tagsArray);
  };

  const handleEditingTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setEditingTags(tagsArray);
  };

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Sidebar for Profile Information */}
        <div className="w-1/4 p-6 tertiary border-r border-gray-200">
          <div className="flex flex-col items-center">
            {user?.profile_picture && (
              <img
                src={user.profile_picture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            )}
            <h1 className="text-3xl font-bold primary mb-2">
              {user?.username}
            </h1>
            <p className="text-white">Welcome to your profile!</p>
            <AnimatedButton
              onClick={() => navigate("/")}
              type="button"
              className="mt-6 x-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Return to Home
            </AnimatedButton>
          </div>
        </div>

        {/* Main Content for Posts */}
        <div className="flex-1 p-6 tertiary">
          <h1 className="text-3xl font-bold primary mb-4">My Posts</h1>
          {/* Create/Edit Post Section */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title..."
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content..."
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
          <input
            type="text"
            value={tags.join(", ")}
            onChange={handleTagsChange}
            placeholder="Tags, separated by comma..."
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <AnimatedButton
            onClick={handleMakePost}
            className="primary px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Create Post
          </AnimatedButton>

          {/* User Posts Section */}
          <div className="mt-6 space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-6 tertiary border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                {editingPostId === post.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <textarea
                      ref={contentTextareaRef}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={Math.max(editingContent.split("\n").length, 4)}
                    />
                    <input
                      type="text"
                      value={editingTags.join(", ")}
                      onChange={handleEditingTagsChange}
                      className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditingImage(
                          e.target.files ? e.target.files[0] : null,
                        )
                      }
                      className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      onClick={() => handleChangePost(post.id)}
                      className="primary px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingPostId(null)}
                      className="primary px-4 py-2 rounded-lg hover:bg-gray-600 transition ml-2"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-2">
                      <p className="text-sm text-gray-300">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags &&
                          post.tags.map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="secondary text-sm px-2 py-1 rounded !text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </div>
                    <p className="text-2xl mb-2 font-bold secondary">
                      {post.title}
                    </p>
                    <p className="text-xl mb-2 font-white whitespace-pre-wrap">
                      {post.content}
                    </p>
                    {post.image && (
                      <div className="mt-4">
                        <img
                          src={import.meta.env.VITE_BASE_URL + "/" + post.image}
                          alt="Post content"
                          className="rounded-lg object-cover w-full"
                        />
                      </div>
                    )}
                    <div className="flex items-center mt-4">
                      <div className="flex gap-2 ml-auto">
                        <AnimatedButton
                          onClick={() => startEditingPost(post)}
                          type="button"
                        >
                          Edit
                        </AnimatedButton>
                        <AnimatedButton
                          onClick={() => handleRemovePost(post.id)}
                          type="button"
                        >
                          Delete
                        </AnimatedButton>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

