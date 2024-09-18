import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';

function Feedback({ supabase }) {
    const [feedback, setFeedback] = useState({
        name: '',
        email: '',
        eventName: '',
        rating: 0,
        comments: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback(prev => ({ ...prev, [name]: value }));
    };

    const handleStarClick = (rating) => {
        setFeedback(prev => ({ ...prev, rating }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('feedback')
                .insert([feedback]);

            if (error) throw error;
            toast.success('Feedback submitted successfully!');
            setFeedback({
                name: '',
                email: '',
                eventName: '',
                rating: 0,
                comments: ''
            });
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
        >
            <h1 className="text-4xl text-indigo-400 mb-8">Event Feedback</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg">
                <div>
                    <label htmlFor="name" className="block text-sm text-gray-300">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={feedback.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm text-gray-300">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={feedback.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="eventName" className="block text-sm text-gray-300">Event Name</label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        value={feedback.eventName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-300 mb-2">Rating</label>
                    <div className="flex">
                        {[...Array(5)].map((star, i) => {
                            const ratingValue = i + 1;
                            return (
                                <FaStar
                                    key={i}
                                    className="cursor-pointer"
                                    color={ratingValue <= feedback.rating ? "#ffc107" : "#e4e5e9"}
                                    size={24}
                                    onClick={() => handleStarClick(ratingValue)}
                                />
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label htmlFor="comments" className="block text-sm text-gray-300">Comments</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={feedback.comments}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    ></textarea>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                    >
                        Submit Feedback
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

export default Feedback;