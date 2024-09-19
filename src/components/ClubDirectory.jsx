import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
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

function ClubDirectory({ supabase }) {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');

    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        fetchClubs();
    }, []);

    async function fetchClubs() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('clubs')
                .select('*')
                .order('name');
            if (error) throw error;
            setClubs(data);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    const filteredClubs = clubs.filter(club =>
        (filter === 'All' || club.category === filter) &&
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const categories = ['All', ...new Set(clubs.map(club => club.category))];

    const handleJoinClub = (clubId) => {
        // Here we can navigate to a ClubDetails page, or trigger a modal/form to join
        navigate(`/club/${clubId}`); // Assuming you have a route like /club/:id for club details
    };

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
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Club Directory</h1>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
                <input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64 p-2 border border-gray-300 rounded-md mb-4 md:mb-0"
                />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
                >
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
            >
                {filteredClubs.map(club => (
                    <motion.div
                        key={club.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col"
                        variants={itemVariants}
                    >
                        <div className="p-6 flex-grow">
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">{club.name}</h3>
                            <p className="text-gray-600 mb-2">Category: {club.category}</p>
                            <p className="text-gray-600 mb-2">Members: {club.member_count}</p>
                            <p className="text-gray-700">{club.description}</p>
                        </div>
                        <div className="p-6 bg-gray-50">
                            <button
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                                onClick={() => handleJoinClub(club.id)} // Handle join button click
                            >
                                Join Club
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {filteredClubs.length === 0 && (
                <p className="text-center text-gray-600 mt-6">No clubs found matching your criteria.</p>
            )}
        </motion.div>
    );
}

export default ClubDirectory;
