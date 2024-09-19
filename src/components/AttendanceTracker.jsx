import React, { useState, useEffect } from 'react';
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

function AttendanceTracker({ supabase }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch events on component load
    useEffect(() => {
        fetchEvents();
    }, []);

    // Fetch attendees when an event is selected
    useEffect(() => {
        if (selectedEvent) {
            fetchAttendees(selectedEvent);
        }
    }, [selectedEvent]);

    // Fetch events from the database
    async function fetchEvents() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: false });
            if (error) throw error;
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch events. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    // Fetch attendees for the selected event
    async function fetchAttendees(event) {
        if (!event) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('attendees')
                .select('*')
                .eq('event_id', event.id);  // Removed created_at ordering since it doesn't exist
            if (error) throw error;
            setAttendees(data);
        } catch (error) {
            console.error('Error fetching attendees:', error);
            toast.error('Failed to fetch attendees. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Event Attendance</h1>

            {/* Event Selection Dropdown */}
            <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Select Event</h2>
                <select
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedEvent?.id || ''}
                    onChange={(e) => {
                        const event = events.find(event => event.id === parseInt(e.target.value));
                        setSelectedEvent(event);
                    }}
                >
                    <option value="">Select an event</option>
                    {events.map(event => (
                        <option key={event.id} value={event.id}>
                            {event.title} - {new Date(event.date).toLocaleDateString()}
                        </option>
                    ))}
                </select>
            </motion.section>

            {/* Display Selected Event and Attendees */}
            {selectedEvent && (
                <motion.section variants={itemVariants}>
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">Attendance Information</h2>
                    <div className="bg-gray-100 p-4 rounded-md mb-4">
                        <p><strong>Event:</strong> {selectedEvent.title}</p>
                        <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {selectedEvent.time}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Total Attendees:</strong> {attendees.length}</p>
                    </div>

                    {/* Attendee List */}
                    {loading ? (
                        <p className="text-center text-gray-600">Loading attendance information...</p>
                    ) : attendees.length > 0 ? (
                        <div>
                            <h3 className="text-xl font-semibold text-blue-700 mb-2">Attendee List</h3>
                            <ul className="space-y-2">
                                {attendees.map(attendee => (
                                    <li key={attendee.id} className="bg-white p-3 rounded-md shadow">
                                        <p><strong>Name:</strong> {attendee.name}</p>
                                        <p><strong>Student ID:</strong> {attendee.student_id}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No attendees registered for this event yet.</p>
                    )}
                </motion.section>
            )}
        </motion.div>
    );
}

export default AttendanceTracker;
