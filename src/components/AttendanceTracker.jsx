import React, { useState } from 'react';

const initialEvents = [
    { id: 1, name: 'Tech Talk: AI and the Future', date: '2024-09-20', attendees: 42 },
    { id: 2, name: 'Annual Club Fair', date: '2024-09-22', attendees: 150 },
    { id: 3, name: 'Debate Competition Finals', date: '2024-09-25', attendees: 75 },
];

function AttendanceTracker() {
    const [events, setEvents] = useState(initialEvents);
    const [newAttendee, setNewAttendee] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleAddAttendee = (eventId) => {
        if (newAttendee.trim() === '') return;
        setEvents(events.map(event =>
            event.id === eventId
                ? { ...event, attendees: event.attendees + 1 }
                : event
        ));
        setNewAttendee('');
        setSelectedEvent(null);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-center text-indigo-400 mb-8">Attendance Tracker</h1>
            <section className="bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-2xl font-semibold mb-6 text-indigo-300">Event Attendance</h2>
                <div className="space-y-4">
                    {events.map(event => (
                        <div key={event.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-indigo-300">{event.name}</h3>
                                <p className="text-gray-400">Date: {event.date}</p>
                                <p className="text-gray-400">Attendees: {event.attendees}</p>
                            </div>
                            <button
                                onClick={() => setSelectedEvent(event.id)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Add Attendee
                            </button>
                        </div>
                    ))}
                </div>
            </section>
            {selectedEvent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4 text-indigo-300">Add Attendee</h3>
                        <input
                            type="text"
                            value={newAttendee}
                            onChange={(e) => setNewAttendee(e.target.value)}
                            placeholder="Enter attendee name"
                            className="w-full rounded-md bg-gray-700 border-gray-600 text-white mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAddAttendee(selectedEvent)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AttendanceTracker;