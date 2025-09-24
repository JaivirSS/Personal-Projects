import { useState, useRef, useEffect } from "react";
import { Post } from "../http/post/post";
import Profile from "../assets/images/profile.png";
import { useNavigate } from "react-router";
import AnimatedButton from "./AnimatedButton";

type Props = {
  post: Post;
  isUser: boolean;
};

export default function PostItem({ post, isUser }: Props) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const maxLines = 3;

  const formattedDate = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(contentRef.current).lineHeight,
      );
      const maxHeight = lineHeight * maxLines;
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [post.content]);

  const hasShoppingTag =
    post.tags &&
    post.tags.some((tag) => {
      const normalizedTag = tag.trim().toLowerCase();
      return normalizedTag === "shopping";
    });

  const handleChatButtonClick = (user_id: number) => {
    navigate(`/chat?user_id=${user_id}`);
  };

  return (
    <article className="group relative p-6 bg-gray-800 rounded-lg mb-6 shadow-lg transition-all hover:bg-gray-750">
      {/* Chat Button */}
      {hasShoppingTag && !isUser && (
        <AnimatedButton
          onClick={() => handleChatButtonClick(post.user_id)}
          className="absolute top-4 right-4 px-4 py-2 rounded-lg text-xl secondary !shadow-none !bg-transparent"
        >
          💬
        </AnimatedButton>
      )}

      <div className="flex items-center gap-x-2 text-sm text-gray-300 mb-2">
        <time dateTime={post.created_at}>{formattedDate}</time>
        {post.tags && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="secondary text-sm px-2 py-1 rounded !text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <h1 className="text-2xl font-semibold secondary mb-3">{post.title}</h1>

      <div className="relative">
        <p
          ref={contentRef}
          className={`text-white mb-4 transition-all duration-300 ${
            !isExpanded ? "line-clamp-3" : "line-clamp-none"
          }`}
        >
          {post.content}
        </p>

        {isOverflowing && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-400 hover:text-blue-300 text-sm mt-1 font-medium"
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-x-3">
        <img
          src={Profile}
          alt={`${post.user.user_name}'s photo`}
          className="w-10 h-10 object-cover rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-300">
            {post.user.user_name}
          </p>
        </div>
      </div>

      {post.image && (
        <div className="mt-4">
          <img
            src={import.meta.env.VITE_BASE_URL + "/" + post.image}
            alt="Post content"
            className="rounded-lg object-cover w-full"
          />
        </div>
      )}
    </article>
  );
}

