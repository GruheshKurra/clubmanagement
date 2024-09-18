import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function CommunicationHub({ supabase }) {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
        try {
            const { data, error } = await supabase
                .from('announcements')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            toast.error('Failed to fetch announcements. Please try again later.');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('announcements')
                .insert([{ ...newAnnouncement, author: 'Current User' }]);
            if (error) throw error;
            toast.success('Announcement posted successfully');
            fetchAnnouncements();
            setNewAnnouncement({ title: '', content: '' });
        } catch (error) {
            console.error('Error posting announcement:', error);
            toast.error('Failed to post announcement. Please try again.');
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            <h1 className="text-4xl text-indigo-400 mb-8">Communication Hub</h1>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Post an Announcement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Announcement Title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <textarea
                        placeholder="Announcement Content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded text-white h-32"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Post Announcement
                    </button>
                </form>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Recent Announcements</h2>
                <div className="space-y-6">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-gray-700 p-4 rounded-md">
                            <h3 className="text-xl text-indigo-300 mb-2">{announcement.title}</h3>
                            <p className="text-gray-300 mb-2">{announcement.content}</p>
                            <p className="text-sm text-gray-400">
                                Posted by {announcement.author} on {new Date(announcement.created_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}

export default CommunicationHub;