import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function EventFeedback({ supabase }) {
    const [events, setEvents] = useState([]);
    const [feedback, setFeedback] = useState({
        eventId: '',
        rating: 5,
        comments: '',
        wouldRecommend: false,
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('id, title')
            .order('date', { ascending: false });
        if (error) {
            toast.error('Failed to fetch events');
        } else {
            setEvents(data);
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFeedback(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('event_feedback')
                .insert([feedback]);
            if (error) throw error;
            toast.success('Thank you for your feedback!');
            setFeedback({
                eventId: '',
                rating: 5,
                comments: '',
                wouldRecommend: false,
            });
        } catch (error) {
            toast.error('Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Event Feedback</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="eventId" className="block text-sm font-medium text-gray-700">Select Event</label>
                    <select
                        id="eventId"
                        name="eventId"
                        value={feedback.eventId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        required
                    >
                        <option value="">Select an event</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>{event.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
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
                    <div className="text-center text-gray-600">{feedback.rating} / 10</div>
                </div>
                <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comments</label>
                    <textarea
                        id="comments"
                        name="comments"
                        value={feedback.comments}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    ></textarea>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="wouldRecommend"
                        name="wouldRecommend"
                        checked={feedback.wouldRecommend}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="wouldRecommend" className="ml-2 block text-sm text-gray-700">
                        I would recommend this event to others
                    </label>
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Submit Feedback
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EventFeedback;