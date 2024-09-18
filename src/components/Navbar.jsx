import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ supabase }) {
    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [isEventsOpen, setIsEventsOpen] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('id, title')
            .order('date', { ascending: true })
            .limit(5);

        if (data) setEvents(data);
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-primary-600 text-lg font-semibold">SCMS</Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link to="/" className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm transition-colors duration-300">Home</Link>
                            <div className="relative" onMouseEnter={() => setIsEventsOpen(true)} onMouseLeave={() => setIsEventsOpen(false)}>
                                <button className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm transition-colors duration-300">
                                    Events
                                </button>
                                {isEventsOpen && (
                                    <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {events.map((event) => (
                                                <Link
                                                    key={event.id}
                                                    to={`/event/${event.id}`}
                                                    className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 hover:text-primary-900"
                                                    role="menuitem"
                                                >
                                                    {event.title}
                                                </Link>
                                            ))}
                                            <Link
                                                to="/events"
                                                className="block px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-900 font-medium"
                                                role="menuitem"
                                            >
                                                View All Events
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Link to="/communication-hub" className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm transition-colors duration-300">Communication Hub</Link>
                            <Link to="/club-directory" className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm transition-colors duration-300">Club Directory</Link>
                            <Link to="/dashboard" className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm transition-colors duration-300">Dashboard</Link>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-primary-600 hover:text-primary-800 px-3 py-2 rounded-md text-sm transition-colors duration-300">
                            Menu
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" className="text-primary-600 hover:text-primary-800 block px-3 py-2 rounded-md text-base transition-colors duration-300">Home</Link>
                        <Link to="/events" className="text-primary-600 hover:text-primary-800 block px-3 py-2 rounded-md text-base transition-colors duration-300">Events</Link>
                        <Link to="/communication-hub" className="text-primary-600 hover:text-primary-800 block px-3 py-2 rounded-md text-base transition-colors duration-300">Communication Hub</Link>
                        <Link to="/club-directory" className="text-primary-600 hover:text-primary-800 block px-3 py-2 rounded-md text-base transition-colors duration-300">Club Directory</Link>
                        <Link to="/dashboard" className="text-primary-600 hover:text-primary-800 block px-3 py-2 rounded-md text-base transition-colors duration-300">Dashboard</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;