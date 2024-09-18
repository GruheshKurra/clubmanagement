import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

function Home({ supabase }) {
    const [events, setEvents] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        fetchEvents();
        fetchBlogPosts();
        fetchGalleryImages();
    }, []);

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
            .limit(3);
        if (data) setEvents(data);
    }

    async function fetchBlogPosts() {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
        if (data) setBlogPosts(data);
    }

    async function fetchGalleryImages() {
        const { data, error } = await supabase
            .from('gallery')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3);
        if (data) setGalleryImages(data);
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-100"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Hero Section */}
            <motion.section variants={itemVariants} className="relative py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-blue-600 opacity-50">
                    <svg className="absolute bottom-0 left-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                        <path fill="#ffffff" fillOpacity="0.2" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Welcome to Student Club Management</h1>
                    <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        Explore, Engage, and Excel with our vibrant community
                    </p>
                    <Link
                        to="/registration"
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors duration-300 shadow-xl hover:shadow-2xl"
                    >
                        Join a Club
                    </Link>
                </div>
            </motion.section>

            {/* Upcoming Events */}
            <motion.section variants={itemVariants} className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {events.map(event => (
                        <motion.div
                            key={event.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={`/api/placeholder/400/200`}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                                <p className="text-blue-600 mb-4">
                                    {new Date(event.date).toLocaleDateString()} | {event.time}
                                </p>
                                <Link
                                    to={`/event/${event.id}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/events" className="text-blue-600 hover:text-blue-800 font-medium">
                        View All Events →
                    </Link>
                </div>
            </motion.section>

            {/* Latest Blog Posts */}
            <motion.section variants={itemVariants} className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Latest Blog Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {blogPosts.map(post => (
                            <motion.div
                                key={post.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl"
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={`/api/placeholder/400/200`}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Read More →
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
                            View All Posts →
                        </Link>
                    </div>
                </div>
            </motion.section>

            {/* Gallery */}
            <motion.section variants={itemVariants} className="container mx-auto px-4 py-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {galleryImages.map(image => (
                        <motion.div
                            key={image.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl"
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={image.image_url || `/api/placeholder/400/400`}
                                alt={image.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <p className="text-gray-600">{image.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/gallery" className="text-blue-600 hover:text-blue-800 font-medium">
                        View Full Gallery →
                    </Link>
                </div>
            </motion.section>

            {/* Features */}
            <motion.section variants={itemVariants} className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Explore Our Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <FeatureCard
                            title="Club Directory"
                            description="Discover and join a wide variety of student clubs."
                            link="/club-directory"
                            linkText="Browse Clubs"
                        />
                        <FeatureCard
                            title="Event Scheduling"
                            description="Easily schedule and manage club events."
                            link="/event-scheduling"
                            linkText="Schedule an Event"
                        />
                        <FeatureCard
                            title="Communication Hub"
                            description="Stay connected with club members and announcements."
                            link="/communication-hub"
                            linkText="Connect Now"
                        />
                        <FeatureCard
                            title="Student Dashboard"
                            description="Track your club activities and achievements."
                            link="/dashboard"
                            linkText="View Dashboard"
                        />
                        <FeatureCard
                            title="Event Feedback"
                            description="Share your thoughts on recent events."
                            link="/event-feedback"
                            linkText="Give Feedback"
                        />
                        <FeatureCard
                            title="Attendance Tracker"
                            description="Keep track of event participation."
                            link="/attendance"
                            linkText="Check Attendance"
                        />
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
}

function FeatureCard({ title, description, link, linkText }) {
    return (
        <motion.div
            className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-2xl"
            whileHover={{ scale: 1.05 }}
        >
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <Link to={link} className="text-blue-600 hover:text-blue-800 font-medium">
                {linkText} →
            </Link>
        </motion.div>
    );
}

export default Home;
