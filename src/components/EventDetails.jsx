import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function EventDetails({ supabase }) {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        fetchEvent();
    }, [id]);

    async function fetchEvent() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setEvent(data);
        } catch (error) {
            toast.error('Failed to fetch event details');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="text-center mt-8">Loading event details...</div>;
    }

    if (!event) {
        return <div className="text-center mt-8">Event not found.</div>;
    }

    return (
        <div className="container mx-auto mt-8 px-4">
            <Link to="/events" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Events</Link>
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <p className="text-gray-600 mb-2">
                    <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600 mb-2">
                    <strong>Time:</strong> {event.time}
                </p>
                <p className="text-gray-600 mb-2">
                    <strong>Duration:</strong> {event.duration} minutes
                </p>
                <p className="text-gray-600 mb-2">
                    <strong>Location:</strong> {event.location}
                </p>
                <p className="text-gray-600 mt-4">
                    <strong>Description:</strong>
                </p>
                <p className="text-gray-800 mt-2">{event.description}</p>
            </div>
        </div>
    );
}

export default EventDetails;