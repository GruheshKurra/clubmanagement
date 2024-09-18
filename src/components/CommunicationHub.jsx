import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

function CommunicationHub({ supabase }) {
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]);
    const [importantInfo, setImportantInfo] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);
            await Promise.all([
                fetchAnnouncements(),
                fetchEvents(),
                fetchImportantInfo()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    async function fetchAnnouncements() {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        if (error) throw error;
        setAnnouncements(data);
    }

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true })
            .limit(5);
        if (error) throw error;
        setEvents(data);
    }

    async function fetchImportantInfo() {
        const { data, error } = await supabase
            .from('important_info')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);
        if (error) throw error;
        setImportantInfo(data);
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <motion.div
            className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Communication Hub</h1>

            <motion.section variants={itemVariants} className="mb-12">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Latest Announcements</h2>
                {announcements.length > 0 ? (
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className="bg-blue-50 p-4 rounded-md shadow">
                                <h3 className="text-xl font-semibold text-blue-700 mb-2">{announcement.title}</h3>
                                <p className="text-gray-700 mb-2">{announcement.content}</p>
                                <p className="text-sm text-gray-500">
                                    Posted on {new Date(announcement.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No announcements at this time.</p>
                )}
            </motion.section>

            <motion.section variants={itemVariants} className="mb-12">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Upcoming Events</h2>
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {events.map((event) => (
                            <div key={event.id} className="bg-green-50 p-4 rounded-md shadow">
                                <h3 className="text-xl font-semibold text-green-700 mb-2">{event.title}</h3>
                                <p className="text-gray-700 mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p className="text-gray-700 mb-1">Time: {event.time}</p>
                                <p className="text-gray-700 mb-1">Location: {event.location}</p>
                                <p className="text-gray-600 mt-2">{event.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No upcoming events at this time.</p>
                )}
            </motion.section>

            <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Important Information</h2>
                {importantInfo.length > 0 ? (
                    <div className="space-y-4">
                        {importantInfo.map((info) => (
                            <div key={info.id} className="bg-yellow-50 p-4 rounded-md shadow">
                                <h3 className="text-xl font-semibold text-yellow-700 mb-2">{info.title}</h3>
                                <p className="text-gray-700">{info.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">No important information at this time.</p>
                )}
            </motion.section>
        </motion.div>
    );
}

export default CommunicationHub;