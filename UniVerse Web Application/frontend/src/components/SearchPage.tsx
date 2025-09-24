import { useState, useEffect } from 'react';
import PostItem from './PostItem'; // Import the PostItem component
import { getPosts } from '../http/post/post'; // Import the getPosts function
import { Post } from '../http/post/post'; // Import the Post type
import { AuthHandler, Token } from '../util/auth/auth';
import { useRouteLoaderData } from 'react-router';

export default function SearchPage() {
    const [allPosts, setAllPosts] = useState<Post[]>([]); // State to store all posts
    const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // State to store filtered posts
    const [isLoading, setIsLoading] = useState(true); // State to handle loading state
    const token: Token | undefined = useRouteLoaderData("root") 
    // Fetch all posts on component mount
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPosts({ tags: [] }); // Fetch all posts (no tags filter)
                setAllPosts(posts.posts);
                setFilteredPosts(posts.posts); // Initially, show all posts
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setIsLoading(false); // Set loading to false after fetching
            }
        };
        fetchPosts();
    }, []);


    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Filter posts based on search query
    useEffect(() => {
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = allPosts.filter(post => 
                post.title.toLowerCase().includes(lowerCaseQuery) || 
                post.content.toLowerCase().includes(lowerCaseQuery) || 
                (post.tags && post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
            );
            setFilteredPosts(filtered);
        } else {
            setFilteredPosts(allPosts); // If no search query, show all posts
        }
    }, [searchQuery, allPosts]);

    return (
        <div className="p-6 tertiary min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-6">Search Posts</h1>
            
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            />

            {/* Display Loading State */}
            {isLoading ? (
                <p className="text-gray-400">Loading posts...</p>
            ) : (
                /* Display Filtered Posts */
                <div>
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map(post => (
                            <PostItem
                                isUser={token ?post.user_id == AuthHandler.decodeAccessToken(token): false}
                                key={post.id}
                                post={post}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400">No posts found.</p>
                    )}
                </div>
            )}
        </div>
    );
}