import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function EventScheduling({ supabase }) {
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        time: '',
        duration: '',
        location: '',
        description: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });
            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch events. Please try again later.');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('events')
                .insert([newEvent]);
            if (error) throw error;
            toast.success('Event scheduled successfully');
            fetchEvents();
            setNewEvent({ title: '', date: '', time: '', duration: '', location: '', description: '' });
        } catch (error) {
            console.error('Error scheduling event:', error);
            toast.error('Failed to schedule event. Please try again.');
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
        >
            <h1 className="text-4xl text-indigo-400 mb-8">Event Scheduling</h1>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Schedule New Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="date"
                            name="date"
                            value={newEvent.date}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                            required
                        />
                        <input
                            type="time"
                            name="time"
                            value={newEvent.time}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-gray-700 rounded text-white"
                            required
                        />
                    </div>
                    <input
                        type="number"
                        name="duration"
                        placeholder="Duration (in minutes)"
                        value={newEvent.duration}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Event Location"
                        value={newEvent.location}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Event Description"
                        value={newEvent.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Schedule Event
                    </button>
                </form>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Scheduled Events</h2>
                {events.length > 0 ? (
                    <ul className="space-y-4">
                        {events.map((event) => (
                            <li key={event.id} className="bg-gray-700 p-4 rounded-md">
                                <h3 className="text-xl text-indigo-300">{event.title}</h3>
                                <p className="text-gray-300">Date: {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                                <p className="text-gray-300">Duration: {event.duration} minutes</p>
                                <p className="text-gray-300">Location: {event.location}</p>
                                <p className="text-gray-400 mt-2">{event.description}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No events scheduled yet.</p>
                )}
            </section>
        </motion.div>
    );
}

export default EventScheduling;