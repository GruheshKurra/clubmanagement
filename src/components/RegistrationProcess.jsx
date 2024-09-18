import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function RegistrationProcess({ supabase }) {
    const [clubs, setClubs] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        studentId: '',
        clubId: '',
        reason: '',
        experience: 'Beginner'
    });

    useEffect(() => {
        fetchClubs();
    }, []);

    async function fetchClubs() {
        try {
            const { data, error } = await supabase
                .from('clubs')
                .select('id, name')
                .order('name');
            if (error) throw error;
            setClubs(data);
        } catch (error) {
            console.error('Error fetching clubs:', error);
            toast.error('Failed to fetch clubs. Please try again later.');
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('club_registrations')
                .insert([formData]);
            if (error) throw error;
            toast.success('Registration submitted successfully!');
            setFormData({
                fullName: '',
                email: '',
                studentId: '',
                clubId: '',
                reason: '',
                experience: 'Beginner'
            });
        } catch (error) {
            console.error('Error submitting registration:', error);
            toast.error('Failed to submit registration. Please try again.');
        }
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Club Registration</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
                    <select
                        id="clubId"
                        name="clubId"
                        value={formData.clubId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select a club</option>
                        {clubs.map(club => (
                            <option key={club.id} value={club.id}>{club.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Joining</label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        Register
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

export default RegistrationProcess;