import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendar, FaUsers, FaBullhorn, FaImage, FaBlog } from 'react-icons/fa';

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
    const [clubs, setClubs] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        setError(null);
        try {
            const [eventsData, clubsData, announcementsData, galleryData, blogData] = await Promise.all([
                supabase.from('events').select('*').order('date', { ascending: true }).limit(3),
                supabase.from('clubs').select('*').limit(3),
                supabase.from('announcements').select('*').order('date', { ascending: false }).limit(3),
                supabase.from('gallery').select('*').limit(3), // Removed created_at ordering
                supabase.from('blog_posts').select('*').limit(3) // Removed created_at ordering
            ]);

            setEvents(eventsData.data || []);
            setClubs(clubsData.data || []);
            setAnnouncements(announcementsData.data || []);
            setGalleryImages(galleryData.data || []);
            setBlogPosts(blogData.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
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
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">Welcome to Student Club Management</h1>
                    <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        Explore, Engage, and Excel with our vibrant community
                    </p>
                    <Link
                        to="/club-directory"
                        className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors duration-300 shadow-xl hover:shadow-2xl"
                    >
                        Explore Clubs
                    </Link>
                </div>
            </motion.section>

            {/* Upcoming Events */}
            <Section title="Upcoming Events" icon={<FaCalendar />} link="/events">
                {events.length > 0 ? events.map(event => (
                    <EventCard key={event.id} event={event} />
                )) : <NoDataMessage message="No upcoming events." />}
            </Section>

            {/* Featured Clubs */}
            <Section title="Featured Clubs" icon={<FaUsers />} link="/club-directory" bgColor="bg-blue-50">
                {clubs.length > 0 ? clubs.map(club => (
                    <ClubCard key={club.id} club={club} />
                )) : <NoDataMessage message="No clubs available." />}
            </Section>

            {/* Latest Announcements */}
            <Section title="Latest Announcements" icon={<FaBullhorn />} link="/announcements">
                {announcements.length > 0 ? announcements.map(announcement => (
                    <AnnouncementCard key={announcement.id} announcement={announcement} />
                )) : <NoDataMessage message="No announcements available." />}
            </Section>

            {/* Gallery */}
            <Section title="Gallery" icon={<FaImage />} link="/gallery" bgColor="bg-blue-50">
                {galleryImages.length > 0 ? galleryImages.map(image => (
                    <GalleryCard key={image.id} image={image} />
                )) : <NoDataMessage message="No gallery images available." />}
            </Section>

            {/* Blog Posts */}
            <Section title="Latest Blog Posts" icon={<FaBlog />} link="/blog-posts">
                {blogPosts.length > 0 ? blogPosts.map(post => (
                    <BlogCard key={post.id} post={post} />
                )) : <NoDataMessage message="No blog posts available." />}
            </Section>
        </motion.div>
    );
}

function Section({ title, icon, link, children, bgColor = 'bg-white' }) {
    return (
        <motion.section variants={itemVariants} className={`py-16 ${bgColor}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                        {icon && <span className="mr-2">{icon}</span>}
                        {title}
                    </h2>
                    <Link to={link} className="text-blue-600 hover:text-blue-800 font-medium">
                        View All →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {children}
                </div>
            </div>
        </motion.section>
    );
}

function NoDataMessage({ message }) {
    return <div className="col-span-3 text-center text-gray-500">{message}</div>;
}

function EventCard({ event }) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
        >
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-blue-600 mb-2">
                    {new Date(event.date).toLocaleDateString()} | {event.time}
                </p>
                <p className="text-gray-600 mb-4">{event.location}</p>
                <Link
                    to={`/event/${event.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Learn More →
                </Link>
            </div>
        </motion.div>
    );
}

function ClubCard({ club }) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
        >
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{club.name}</h3>
                <p className="text-gray-600 mb-4">{club.description && club.description.substring(0, 100)}...</p>
                <Link
                    to={`/club/${club.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    View Club →
                </Link>
            </div>
        </motion.div>
    );
}

function AnnouncementCard({ announcement }) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
        >
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{announcement.title}</h3>
                <p className="text-gray-600 mb-2">{announcement.content && announcement.content.substring(0, 100)}...</p>
                <p className="text-blue-600">{new Date(announcement.date).toLocaleDateString()}</p>
            </div>
        </motion.div>
    );
}

function GalleryCard({ image }) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
        >
            {image.image_url ? (
                <img src={image.image_url} alt={image.title} className="w-full h-48 object-cover" />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{image.title}</h3>
                <p className="text-gray-600">{image.description && image.description.substring(0, 50)}...</p>
            </div>
        </motion.div>
    );
}

function BlogCard({ post }) {
    return (
        <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
            whileHover={{ scale: 1.03 }}
        >
            {post.image_url ? (
                <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
            ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
            )}
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.content && post.content.substring(0, 100)}...</p>
                <Link
                    to={`/blog/${post.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    Read More →
                </Link>
            </div>
        </motion.div>
    );
}

export default Home;
