import React from 'react';

function EventsCalendar() {
    // This is a placeholder. In a real application, you'd integrate with a calendar library.
    const events = [
        { id: 1, name: 'Tech Talk', date: '2024-09-20', time: '14:00', club: 'Computer Science Club' },
        { id: 2, name: 'Art Exhibition', date: '2024-09-22', time: '10:00', club: 'Fine Arts Society' },
        { id: 3, name: 'Debate Competition', date: '2024-09-25', time: '16:00', club: 'Debating Society' },
    ];

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Upcoming Events</h2>
            <div className="space-y-4">
                {events.map(event => (
                    <div key={event.id} className="bg-gray-700 p-4 rounded-lg">
                        <h3 className="text-xl font-medium text-teal-400">{event.name}</h3>
                        <p>Date: {event.date}</p>
                        <p>Time: {event.time}</p>
                        <p>Organized by: {event.club}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EventsCalendar;