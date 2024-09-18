import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function StudentDashboard({ supabase }) {
    const [studentInfo, setStudentInfo] = useState({
        name: 'John Doe',
        id: '12345',
        major: 'Computer Science',
        year: 'Junior'
    });
    const [clubMemberships, setClubMemberships] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        fetchStudentData();
        fetchClubMemberships();
        fetchUpcomingEvents();
        fetchRecentActivities();
    }, []);

    async function fetchStudentData() {
        // In a real application, you would fetch this data from your backend
        // For now, we'll use the static data defined above
    }

    async function fetchClubMemberships() {
        try {
            const { data, error } = await supabase
                .from('club_memberships')
                .select('*')
                .eq('student_id', studentInfo.id);
            if (error) throw error;
            setClubMemberships(data);
        } catch (error) {
            console.error('Error fetching club memberships:', error);
            toast.error('Failed to fetch club memberships');
        }
    }

    async function fetchUpcomingEvents() {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gt('date', new Date().toISOString())
                .order('date', { ascending: true })
                .limit(5);
            if (error) throw error;
            setUpcomingEvents(data);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
            toast.error('Failed to fetch upcoming events');
        }
    }

    async function fetchRecentActivities() {
        try {
            const { data, error } = await supabase
                .from('student_activities')
                .select('*')
                .eq('student_id', studentInfo.id)
                .order('date', { ascending: false })
                .limit(5);
            if (error) throw error;
            setRecentActivities(data);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
            toast.error('Failed to fetch recent activities');
        }
    }

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <h1 className="text-4xl text-indigo-400 mb-8">Student Dashboard</h1>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Welcome, {studentInfo.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-300">Student ID: {studentInfo.id}</p>
                        <p className="text-gray-300">Major: {studentInfo.major}</p>
                    </div>
                    <div>
                        <p className="text-gray-300">Year: {studentInfo.year}</p>
                        <p className="text-gray-300">Total Clubs: {clubMemberships.length}</p>
                    </div>
                </div>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Club Memberships</h2>
                {clubMemberships.length > 0 ? (
                    <ul className="space-y-2">
                        {clubMemberships.map(membership => (
                            <li key={membership.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                                <span className="text-gray-300">{membership.club_name}</span>
                                <span className="text-sm bg-indigo-600 text-white px-2 py-1 rounded">{membership.role}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">You are not a member of any clubs yet.</p>
                )}
                <Link to="/club-directory" className="mt-4 inline-block text-indigo-400 hover:underline">Join a Club</Link>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <ul className="space-y-4">
                        {upcomingEvents.map(event => (
                            <li key={event.id} className="bg-gray-700 p-4 rounded">
                                <h3 className="text-lg text-indigo-300">{event.title}</h3>
                                <p className="text-gray-400">Date: {new Date(event.date).toLocaleDateString()}, Time: {event.time}</p>
                                <Link to={`/event/${event.id}`} className="text-sm text-indigo-400 hover:underline">View Details</Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No upcoming events at the moment.</p>
                )}
                <Link to="/events" className="mt-4 inline-block text-indigo-400 hover:underline">View All Events</Link>
            </section>

            <section className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl text-indigo-300 mb-4">Recent Activities</h2>
                {recentActivities.length > 0 ? (
                    <ul className="space-y-4">
                        {recentActivities.map(activity => (
                            <li key={activity.id} className="bg-gray-700 p-4 rounded">
                                <p className="text-gray-300">{activity.description}</p>
                                <p className="text-sm text-gray-400">Date: {new Date(activity.date).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No recent activities to display.</p>
                )}
            </section>
        </motion.div>
    );
}

export default StudentDashboard;