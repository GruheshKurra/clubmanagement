import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function BlogPostDetails({ supabase }) {
    const { id } = useParams(); // Get the blog post ID from the URL
    const [blogPost, setBlogPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogPost();
    }, [id]);

    async function fetchBlogPost() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id) // Fetch the blog post with the matching ID
                .single(); // Expect a single result

            if (error) throw error;
            setBlogPost(data);
        } catch (error) {
            console.error('Error fetching blog post:', error);
            setError('Failed to load the blog post. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="text-center py-20 text-lg font-semibold">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-20 text-lg">{error}</div>;
    }

    if (!blogPost) {
        return <div className="text-center py-20 text-lg">Blog post not found.</div>;
    }

    return (
        <div className="container mx-auto py-12 px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Blog Header Section */}
                <header className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{blogPost.title}</h1>
                    <p className="text-gray-200 text-sm md:text-base">By {blogPost.author}</p>
                </header>

                {/* Blog Image */}
                {blogPost.image_url && (
                    <div className="relative">
                        <img
                            src={blogPost.image_url}
                            alt={blogPost.title}
                            className="w-full max-h-80 object-cover transition-transform duration-300 ease-in-out transform hover:scale-105 rounded-t-lg"
                        />
                    </div>
                )}

                {/* Blog Content */}
                <section className="p-6 lg:p-8 text-gray-700">
                    <div className="prose prose-lg max-w-none">
                        <p>{blogPost.content}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default BlogPostDetails;
