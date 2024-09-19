// src/pages/Announcements.jsx
import React, { useState, useEffect } from 'react';
import PopupModal from '../components/PopupModal';

function Announcements({ supabase }) {
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
        const { data, error } = await supabase.from('announcements').select('*').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching announcements:', error);
        } else {
            setAnnouncements(data || []);
        }
    }

    const openModal = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnnouncement(null);
    };

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Latest Announcements</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-white rounded-lg shadow-lg p-6" onClick={() => openModal(announcement)}>
                        <h2 className="text-xl font-bold">{announcement.title}</h2>
                        <p className="text-gray-600">{announcement.content.substring(0, 100)}...</p>
                        <p className="text-sm text-gray-500">{new Date(announcement.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>

            {/* Modal for announcement details */}
            <PopupModal isOpen={isModalOpen} onClose={closeModal} title={selectedAnnouncement?.title}>
                <p>{selectedAnnouncement?.content}</p>
                <p className="text-sm text-gray-500 mt-4">Posted on {new Date(selectedAnnouncement?.date).toLocaleDateString()}</p>
            </PopupModal>
        </div>
    );
}

export default Announcements;
