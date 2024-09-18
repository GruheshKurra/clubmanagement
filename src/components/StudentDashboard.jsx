import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

function StudentDashboard({ supabase }) {
    const [studentInfo, setStudentInfo] = useState(null);
    const [clubMemberships, setClubMemberships] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            fetchDashboardData(user.id);
        } else {
            setLoading(false);
            toast.error("Please log in to view your dashboard.");
            navigate('/login'); // Ensure you have a login route
        }
    }

    async function fetchDashboardData(userId) {
        try {
            setLoading(true);

            // Fetch student info
            const { data: studentData, error: studentError } = await supabase
                .from('students')
                .select('*')
                .eq('id', userId)
                .single();
            if (studentError) throw studentError;
            setStudentInfo(studentData);

            // Fetch club memberships
            const { data: memberships, error: membershipError } = await supabase
                .from('club_memberships')
                .select('*, clubs(*)')
                .eq('student_id', userId);
            if (membershipError) throw membershipError;
            setClubMemberships(memberships);

            // Fetch upcoming events
            const { data: events, error: eventsError } = await supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true })
                .limit(5);
            if (eventsError) throw eventsError;
            setUpcomingEvents(events);

            // Fetch recent activities
            const { data: activities, error: activitiesError } = await supabase
                .from('student_activities')
                .select('*')
                .eq('student_id', userId)
                .order('created_at', { ascending: false })
                .limit(5);
            if (activitiesError) throw activitiesError;
            setRecentActivities(activities);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (!studentInfo) {
        return <div className="text-center mt-10">
            <p>Please log in to view your dashboard.</p>
            <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>
        </div>;
    }

    return (
        <motion.div
            className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Student Dashboard</h1>

            <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Welcome, {studentInfo.name}</h2>
                <div className="bg-blue-50 p-4 rounded-md shadow">
                    <p className="text-gray-700"><strong>Student ID:</strong> {studentInfo.student_id}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {studentInfo.email}</p>
                    <p className="text-gray-700"><strong>Major:</strong> {studentInfo.major}</p>
                </div>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Club Memberships</h2>
                {clubMemberships.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {clubMemberships.map(membership => (
                            <div key={membership.id} className="bg-white p-4 rounded-md shadow">
                                <h3 className="text-lg font-semibold text-blue-600">{membership.clubs.name}</h3>
                                <p className="text-gray-600">Role: {membership.role}</p>
                                <p className="text-gray-600">Joined: {new Date(membership.joined_date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">You are not a member of any clubs yet.</p>
                )}
                <Link to="/club-directory" className="mt-4 inline-block text-blue-600 hover:underline">Join a Club</Link>
            </motion.section>

            <motion.section variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="bg-white p-4 rounded-md shadow">
                                <h3 className="text-lg font-semibold text-blue-600">{event.title}</h3>
                                <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
                                <p className="text-gray-600">Time: {event.time}</p>
                                <p className="text-gray-600">Location: {event.location}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No upcoming events at this time.</p>
                )}
                <Link to="/events" className="mt-4 inline-block text-blue-600 hover:underline">View All Events</Link>
            </motion.section>

            <motion.section variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">Recent Activities</h2>
                {recentActivities.length > 0 ? (
                    <div className="space-y-4">
                        {recentActivities.map(activity => (
                            <div key={activity.id} className="bg-white p-4 rounded-md shadow">
                                <p className="text-gray-700">{activity.description}</p>
                                <p className="text-sm text-gray-500">{new Date(activity.created_at).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No recent activities to display.</p>
                )}
            </motion.section>
        </motion.div>
    );
}

export default StudentDashboard;