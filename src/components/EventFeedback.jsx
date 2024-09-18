import React, { useState } from 'react';

function EventFeedback() {
    const [feedback, setFeedback] = useState({
        eventName: '',
        rating: 5,
        comments: '',
        wouldRecommend: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFeedback(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', feedback);
        alert('Thank you for your feedback!');
        // Reset form
        setFeedback({
            eventName: '',
            rating: 5,
            comments: '',
            wouldRecommend: false,
        });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-indigo-400 mb-8">Event Feedback</h1>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Share Your Thoughts</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="eventName" className="block text-sm font-medium text-gray-300">Event Name</label>
                        <input
                            type="text"
                            id="eventName"
                            name="eventName"
                            value={feedback.eventName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="rating" className="block text-sm font-medium text-gray-300">Rating</label>
                        <input
                            type="range"
                            id="rating"
                            name="rating"
                            min="1"
                            max="10"
                            value={feedback.rating}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                        />
                        <div className="text-center text-gray-300">{feedback.rating} / 10</div>
                    </div>
                    <div>
                        <label htmlFor="comments" className="block text-sm font-medium text-gray-300">Comments</label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={feedback.comments}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        ></textarea>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="wouldRecommend"
                            name="wouldRecommend"
                            checked={feedback.wouldRecommend}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="wouldRecommend" className="ml-2 block text-sm text-gray-300">
                            I would recommend this event to others
                        </label>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300"
                        >
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default EventFeedback;