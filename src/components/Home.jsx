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
            className="space-y-12 bg-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.section variants={itemVariants} className="text-center py-12 bg-primary-50">
                <h1 className="text-4xl text-primary-700 mb-4">Welcome to Student Club Management System</h1>
                <p className="text-primary-600 mb-6">Explore, Engage, and Excel with our vibrant community</p>
                <Link to="/registration" className="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors duration-300">
                    Join a Club
                </Link>
            </motion.section>

            <motion.section variants={itemVariants} className="container mx-auto px-4">
                <h2 className="text-2xl text-primary-700 mb-4">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white p-4 rounded-md shadow-md border border-primary-100">
                            <img src={`/api/placeholder/400/200`} alt={event.title} className="w-full h-40 object-cover rounded-md mb-4" />
                            <h3 className="text-xl text-primary-600 mb-2">{event.title}</h3>
                            <p className="text-primary-500 mb-2">{new Date(event.date).toLocaleDateString()} | {event.time}</p>
                            <Link to={`/event/${event.id}`} className="text-primary-500 hover:underline">Learn More</Link>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-6">
                    <Link to="/events" className="text-primary-500 hover:underline">View All Events</Link>
                </div>
            </motion.section>

            <motion.section variants={itemVariants} className="container mx-auto px-4">
                <h2 className="text-2xl text-primary-700 mb-4">Latest Blog Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogPosts.map(post => (
                        <div key={post.id} className="bg-white p-4 rounded-md shadow-md border border-primary-100">
                            <img src={`/api/placeholder/400/200`} alt={post.title} className="w-full h-40 object-cover rounded-md mb-4" />
                            <h3 className="text-xl text-primary-600 mb-2">{post.title}</h3>
                            <p className="text-primary-500 mb-2">{post.excerpt}</p>
                            <Link to={`/blog/${post.id}`} className="text-primary-500 hover:underline">Read More</Link>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-6">
                    <Link to="/blog" className="text-primary-500 hover:underline">View All Posts</Link>
                </div>
            </motion.section>

            <motion.section variants={itemVariants} className="container mx-auto px-4">
                <h2 className="text-2xl text-primary-700 mb-4">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {galleryImages.map(image => (
                        <div key={image.id} className="bg-white p-4 rounded-md shadow-md border border-primary-100">
                            <img src={`/api/placeholder/400/400`} alt={image.title} className="w-full h-64 object-cover rounded-md" />
                            <p className="text-primary-500 mt-2">{image.description}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-6">
                    <Link to="/gallery" className="text-primary-500 hover:underline">View Full Gallery</Link>
                </div>
            </motion.section>

            <motion.section variants={itemVariants} className="container mx-auto px-4">
                <h2 className="text-2xl text-primary-700 mb-4">Explore Our Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-md shadow-md border border-primary-100">
                        <h3 className="text-xl text-primary-600 mb-2">Club Directory</h3>
                        <p className="text-primary-500 mb-4">Discover and join a wide variety of student clubs.</p>
                        <Link to="/club-directory" className="text-primary-500 hover:underline">Browse Clubs</Link>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-md border border-primary-100">
                        <h3 className="text-xl text-primary-600 mb-2">Event Scheduling</h3>
                        <p className="text-primary-500 mb-4">Easily schedule and manage club events.</p>
                        <Link to="/event-scheduling" className="text-primary-500 hover:underline">Schedule an Event</Link>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-md border border-primary-100">
                        <h3 className="text-xl text-primary-600 mb-2">Communication Hub</h3>
                        <p className="text-primary-500 mb-4">Stay connected with club members and announcements.</p>
                        <Link to="/communication-hub" className="text-primary-500 hover:underline">Connect Now</Link>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-md border border-primary-100">
                        <h3 className="text-xl text-primary-600 mb-2">Student Dashboard</h3>
                        <p className="text-primary-500 mb-4">Track your club activities and achievements.</p>
                        <Link to="/dashboard" className="text-primary-500 hover:underline">View Dashboard</Link>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-md border border-primary-100">
                        <h3 className="text-xl text-primary-600 mb-2">Event Feedback</h3>
                        <p className="text-primary-500 mb-4">Share your thoughts on recent events.</p>
                        <Link to="/event-feedback" className="text-primary-500 hover:underline">Give Feedback</Link>
                    </div>
                    <div className="bg-white p-6 rounded-md shadow-md border border-primary-100">
                        <h3 className="text-xl text-primary-600 mb-2">Attendance Tracker</h3>
                        <p className="text-primary-500 mb-4">Keep track of event participation.</p>
                        <Link to="/attendance" className="text-primary-500 hover:underline">Check Attendance</Link>
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
}

export default Home;