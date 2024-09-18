import React, { useState, useEffect } from 'react';
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
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });
        if (error) {
            toast.error('Failed to fetch events');
        } else {
            setEvents(data);
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
            toast.error('Failed to schedule event. Please try again.');
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    }

    async function handleDelete(id) {
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);
            if (error) throw error;
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            toast.error('Failed to delete event. Please try again.');
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Event Scheduling</h1>
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
                <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="date"
                        name="date"
                        value={newEvent.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                    <input
                        type="time"
                        name="time"
                        value={newEvent.time}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <input
                    type="number"
                    name="duration"
                    placeholder="Duration (in minutes)"
                    value={newEvent.duration}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Event Location"
                    value={newEvent.location}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Event Description"
                    value={newEvent.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                ></textarea>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                    Schedule Event
                </button>
            </form>

            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Scheduled Events</h2>
            {events.length > 0 ? (
                <ul className="space-y-4">
                    {events.map((event) => (
                        <li key={event.id} className="bg-gray-100 p-4 rounded-md">
                            <h3 className="text-xl text-blue-600">{event.title}</h3>
                            <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                            <p className="text-gray-600">Duration: {event.duration} minutes</p>
                            <p className="text-gray-600">Location: {event.location}</p>
                            <p className="text-gray-600 mt-2">{event.description}</p>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors duration-300"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600">No events scheduled yet.</p>
            )}
        </div>
    );
}

export default EventScheduling;