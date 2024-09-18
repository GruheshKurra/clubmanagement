import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const sampleClubs = [
    { id: 1, name: 'Photography Club', category: 'Arts', memberCount: 45, description: 'Explore the art of photography through workshops, photo walks, and exhibitions.' },
    { id: 2, name: 'Debate Society', category: 'Academic', memberCount: 30, description: 'Enhance your public speaking and critical thinking skills through regular debates and competitions.' },
    { id: 3, name: 'Robotics Club', category: 'Technology', memberCount: 25, description: 'Design, build, and program robots while learning about mechanical and electrical engineering.' },
    { id: 4, name: 'Environmental Awareness Group', category: 'Community Service', memberCount: 50, description: 'Promote sustainability and environmental conservation through campus initiatives and community outreach.' },
    { id: 5, name: 'Culinary Club', category: 'Lifestyle', memberCount: 35, description: 'Learn about different cuisines, cooking techniques, and participate in food-related events.' }
];

function ClubDirectory({ supabase }) {
    const [clubs, setClubs] = useState(sampleClubs);

    useEffect(() => {
        fetchClubs();
    }, []);

    async function fetchClubs() {
        try {
            const { data, error } = await supabase.from('clubs').select('*');
            if (error) throw error;
            setClubs(data.length > 0 ? data : sampleClubs);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs. Displaying sample data.');
        }
    }

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-4xl text-indigo-400 mb-8">Club Directory</h1>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-6">Available Clubs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clubs.map(club => (
                        <motion.div
                            key={club.id}
                            className="bg-gray-700 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <h3 className="text-xl text-indigo-300 mb-2">{club.name}</h3>
                            <p className="text-gray-300 mb-2">Category: {club.category}</p>
                            <p className="text-gray-300 mb-2">Members: {club.memberCount}</p>
                            <p className="text-gray-400 mb-4">{club.description}</p>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300">
                                Join Club
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}

export default ClubDirectory;