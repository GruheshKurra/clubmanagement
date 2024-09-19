import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ supabase }) {
    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [isEventsOpen, setIsEventsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchEvents();
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    async function fetchEvents() {
        const { data, error } = await supabase
            .from('events')
            .select('id, title')
            .order('date', { ascending: true })
            .limit(5);

        if (data) setEvents(data);
    }

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsEventsOpen(false);
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-blue-600 text-xl font-bold">STudentClubsAU</Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <NavLink to="/">Home</NavLink>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsEventsOpen(!isEventsOpen)}
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Events
                                </button>
                                {isEventsOpen && (
                                    <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            {events.map((event) => (
                                                <Link
                                                    key={event.id}
                                                    to={`/event/${event.id}`}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                                                    role="menuitem"
                                                >
                                                    {event.title}
                                                </Link>
                                            ))}
                                            <Link
                                                to="/events"
                                                className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-800 font-medium"
                                                role="menuitem"
                                            >
                                                View All Events
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <NavLink to="/communication-hub">Communication Hub</NavLink>
                            <NavLink to="/club-directory">Club Directory</NavLink>
                            <NavLink to="/attendance">Attendance</NavLink>
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink to="/">Home</MobileNavLink>
                        <MobileNavLink to="/events">Events</MobileNavLink>
                        <MobileNavLink to="/communication-hub">Communication Hub</MobileNavLink>
                        <MobileNavLink to="/club-directory">Club Directory</MobileNavLink>
                        <MobileNavLink to="/attendance">Attendance</MobileNavLink>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ to, children }) {
    return (
        <Link
            to={to}
            className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
        >
            {children}
        </Link>
    );
}

export default Navbar;