import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AdminPage({ supabase }) {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', duration: '', location: '', description: '' });
    const [newClub, setNewClub] = useState({ name: '', category: '', member_count: '', description: '' });
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    async function fetchAllData() {
        setLoading(true);
        setError(null);
        try {
            await Promise.all([
                fetchEvents(),
                fetchClubs(),
                fetchAnnouncements()
            ]);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    async function fetchEvents() {
        try {
            const { data, error } = await supabase.from('events').select('*');
            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            console.error('Error fetching events:', err);
            toast.error('Failed to fetch events');
        }
    }

    async function fetchClubs() {
        try {
            const { data, error } = await supabase.from('clubs').select('*');
            if (error) throw error;
            setClubs(data || []);
        } catch (err) {
            console.error('Error fetching clubs:', err);
            toast.error('Failed to fetch clubs');
        }
    }

    async function fetchAnnouncements() {
        try {
            const { data, error } = await supabase.from('announcements').select('*');
            if (error) throw error;
            setAnnouncements(data || []);
        } catch (err) {
            console.error('Error fetching announcements:', err);
            toast.error('Failed to fetch announcements');
        }
    }

    async function handleEventSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.from('events').insert([newEvent]);
            if (error) throw error;
            toast.success('Event added successfully');
            fetchEvents();
            setNewEvent({ title: '', date: '', time: '', duration: '', location: '', description: '' });
        } catch (err) {
            console.error('Error adding event:', err);
            toast.error('Failed to add event');
        }
    }

    async function handleClubSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.from('clubs').insert([newClub]);
            if (error) throw error;
            toast.success('Club added successfully');
            fetchClubs();
            setNewClub({ name: '', category: '', member_count: '', description: '' });
        } catch (err) {
            console.error('Error adding club:', err);
            toast.error('Failed to add club');
        }
    }

    async function handleAnnouncementSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.from('announcements').insert([newAnnouncement]);
            if (error) throw error;
            toast.success('Announcement added successfully');
            fetchAnnouncements();
            setNewAnnouncement({ title: '', content: '' });
        } catch (err) {
            console.error('Error adding announcement:', err);
            toast.error('Failed to add announcement');
        }
    }

    async function handleDelete(table, id) {
        try {
            const { error } = await supabase.from(table).delete().match({ id });
            if (error) throw error;
            toast.success(`${table} item deleted successfully`);
            fetchAllData();
        } catch (err) {
            console.error(`Error deleting ${table} item:`, err);
            toast.error(`Failed to delete ${table} item`);
        }
    }

    if (loading) {
        return <div className="text-center text-primary-600">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                <p>{error}</p>
                <button
                    onClick={fetchAllData}
                    className="mt-4 bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition-colors duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="admin-page space-y-8">
            <h1 className="text-4xl text-primary-700 mb-8">Admin Dashboard</h1>

            <section className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
                <h2 className="text-2xl text-primary-600 mb-4">Manage Events</h2>
                <form onSubmit={handleEventSubmit} className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="Event Title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            value={newEvent.date}
                            onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                            className="w-full p-2 border border-primary-300 rounded text-primary-800"
                            required
                        />
                        <input
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            className="w-full p-2 border border-primary-300 rounded text-primary-800"
                            required
                        />
                    </div>
                    <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={newEvent.duration}
                        onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    ></textarea>
                    <button type="submit" className="w-full bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition-colors duration-300">
                        Add Event
                    </button>
                </form>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-primary-100">
                                <th className="p-2">Title</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Time</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr key={event.id} className="border-b border-primary-200">
                                    <td className="p-2">{event.title}</td>
                                    <td className="p-2">{event.date}</td>
                                    <td className="p-2">{event.time}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete('events', event.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
                <h2 className="text-2xl text-primary-600 mb-4">Manage Clubs</h2>
                <form onSubmit={handleClubSubmit} className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="Club Name"
                        value={newClub.name}
                        onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newClub.category}
                        onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Member Count"
                        value={newClub.member_count}
                        onChange={(e) => setNewClub({ ...newClub, member_count: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <textarea
                        placeholder="Description"
                        value={newClub.description}
                        onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    ></textarea>
                    <button type="submit" className="w-full bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition-colors duration-300">
                        Add Club
                    </button>
                </form>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-primary-100">
                                <th className="p-2">Name</th>
                                <th className="p-2">Category</th>
                                <th className="p-2">Members</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clubs.map(club => (
                                <tr key={club.id} className="border-b border-primary-200">
                                    <td className="p-2">{club.name}</td>
                                    <td className="p-2">{club.category}</td>
                                    <td className="p-2">{club.member_count}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete('clubs', club.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="bg-white p-6 rounded-lg shadow-md border border-primary-100">
                <h2 className="text-2xl text-primary-600 mb-4">Manage Announcements</h2>
                <form onSubmit={handleAnnouncementSubmit} className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="Announcement Title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    />
                    <textarea
                        placeholder="Content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        className="w-full p-2 border border-primary-300 rounded text-primary-800"
                        required
                    ></textarea>
                    <button type="submit" className="w-full bg-primary-600 text-white p-2 rounded hover:bg-primary-700 transition-colors duration-300">
                        Add Announcement
                    </button>
                </form>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-primary-100">
                                <th className="p-2">Title</th>
                                <th className="p-2">Content</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.map(announcement => (
                                <tr key={announcement.id} className="border-b border-primary-200">
                                    <td className="p-2">{announcement.title}</td>
                                    <td className="p-2">{announcement.content.substring(0, 50)}...</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete('announcements', announcement.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

export default AdminPage;