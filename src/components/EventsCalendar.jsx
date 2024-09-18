import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

function EventsCalendar({ supabase }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    async function fetchEvents() {
        const startDate = startOfMonth(currentDate);
        const endDate = endOfMonth(currentDate);
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString())
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
        } else {
            setEvents(data);
        }
    }

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentDate),
        end: endOfMonth(currentDate)
    });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Events Calendar</h1>
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="text-blue-500 hover:text-blue-700">Previous Month</button>
                <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth} className="text-blue-500 hover:text-blue-700">Next Month</button>
            </div>
            <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold">{day}</div>
                ))}
                {daysInMonth.map(day => {
                    const dayEvents = events.filter(event => isSameDay(new Date(event.date), day));
                    return (
                        <div
                            key={day.toString()}
                            className={`p-2 border ${isSameMonth(day, currentDate) ? 'bg-white' : 'bg-gray-100'} ${dayEvents.length > 0 ? 'border-blue-300' : ''}`}
                        >
                            <div className="text-right">{format(day, 'd')}</div>
                            {dayEvents.map(event => (
                                <div key={event.id} className="text-xs p-1 mt-1 bg-blue-100 rounded">
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EventsCalendar;