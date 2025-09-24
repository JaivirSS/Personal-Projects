import { useEffect, useState } from "react";
import { getPosts, Post } from "../http/post/post";
import FriendList from "../components/FriendsList";
import PostItem from "../components/PostItem";
import { Pagination } from "../components/Pagniation";
import { useRouteLoaderData } from "react-router";
import { AuthHandler, Token } from "../util/auth/auth";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [_, setFavorites] = useState<number[]>([]); // State to track favorited post IDs
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [postsPerPage] = useState(5); // Number of posts per page
  const token: Token | undefined = useRouteLoaderData("root");

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts({ tags: [], page: currentPage });
        setPosts(fetchedPosts.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [currentPage]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );
    setFavorites(savedFavorites);
  }, []);

  // Handle favoriting/unfavoriting a post
  // const handleFavorite = (postId: number) => {
  //   const isFavorited = favorites.includes(postId);
  //   let updatedFavorites;
  //
  //   if (isFavorited) {
  //     updatedFavorites = favorites.filter((id) => id !== postId); // Remove from favorites
  //   } else {
  //     updatedFavorites = [...favorites, postId]; // Add to favorites
  //   }
  //
  //   setFavorites(updatedFavorites);
  //   localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Persist in localStorage
  // };

  // Calculate the index of the first and last post on the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen tertiary">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight primary sm:text-6xl">
            UNIverse
          </h1>
          <p className="mt-4 text-lg secondary">
            Your Campus, Your Community, Your UNIverse
          </p>
        </div>
        <div className="space-y-12 max-w-3xl mx-auto">
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <PostItem
                isUser={
                  token
                    ? post.user_id == AuthHandler.decodeAccessToken(token)
                    : false
                }
                key={post.id}
                post={post}
              />
            ))
          ) : (
            <div className="p-6 rounded-lg text-white text-center text-xl">
              No posts available
            </div>
          )}
        </div>

        {/* Pagination Component */}
        {posts.length > postsPerPage && ( // Only show pagination if there are more posts than postsPerPage
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(posts.length / postsPerPage)}
            onPageChange={paginate}
          />
        )}
      </div>
      <FriendList />
    </div>
  );
}
