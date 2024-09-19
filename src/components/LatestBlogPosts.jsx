import React, { useState, useEffect } from 'react';
import PopupModal from '../components/PopupModal'; // Assuming this component exists

function LatestBlogPosts({ supabase }) {
    const [blogPosts, setBlogPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch blog posts from Supabase
    useEffect(() => {
        fetchBlogPosts();
    }, []);

    async function fetchBlogPosts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*') // Fetch all columns
                .order('id', { ascending: true }); // Order by 'id'

            if (error) throw error;
            setBlogPosts(data); // Set data into state
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            setError('Failed to load blog posts.');
        } finally {
            setLoading(false);
        }
    }

    const openModal = (post) => {
        setSelectedPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPost(null);
    };

    if (loading) {
        return <div className="text-center py-20 text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-20">{error}</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center">Latest Blog Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.length > 0 ? (
                    blogPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                            onClick={() => openModal(post)}
                        >
                            {/* Display the blog post image */}
                            {post.image_url ? (
                                <img
                                    src={post.image_url}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">No Image Available</span>
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold mb-2 text-gray-800">{post.title}</h2>
                                <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
                                <p className="text-sm text-gray-500">By {post.author}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No blog posts available.</p>
                )}
            </div>

            {/* Modal for blog post details */}
            {selectedPost && (
                <PopupModal isOpen={isModalOpen} onClose={closeModal} title={selectedPost?.title}>
                    {/* Display the image in the modal */}
                    {selectedPost.image_url && (
                        <img
                            src={selectedPost.image_url}
                            alt={selectedPost.title}
                            className="w-full h-60 object-cover mb-6 rounded-lg"
                        />
                    )}
                    <p className="text-lg text-gray-700 mb-4">{selectedPost?.content}</p>
                    <p className="text-sm text-gray-500 mt-4">Written by {selectedPost?.author}</p>
                </PopupModal>
            )}
        </div>
    );
}

export default LatestBlogPosts;
