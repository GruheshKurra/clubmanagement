import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

function AdminPage({ supabase }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('events');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [newItem, setNewItem] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData(activeTab);
        }
    }, [activeTab, isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'Sujju@005065') {
            setIsAuthenticated(true);
            toast.success('Successfully authenticated.');
        } else {
            toast.error('Incorrect password');
        }
    };

    async function fetchData(table) {
        setLoading(true);
        try {
            const { data, error } = await supabase.from(table).select('*');
            if (error) throw error;
            setData(data);
        } catch (error) {
            console.error(`Error fetching ${table}:`, error);
            toast.error(`Failed to fetch ${table}. Please try again.`);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(table) {
        try {
            const { error } = await supabase.from(table).insert([newItem]);
            if (error) throw error;
            toast.success(`${table.replace('_', ' ')} created successfully`);
            fetchData(table);
            setNewItem({});
        } catch (error) {
            console.error(`Error creating ${table} item:`, error);
            toast.error(`Failed to create ${table} item. Please try again.`);
        }
    }

    async function handleUpdate(table, id) {
        try {
            const { error } = await supabase.from(table).update(newItem).eq('id', id);
            if (error) throw error;
            toast.success(`${table.replace('_', ' ')} updated successfully`);
            fetchData(table);
            setNewItem({});
            setEditingId(null);
        } catch (error) {
            console.error(`Error updating ${table} item:`, error);
            toast.error(`Failed to update ${table} item. Please try again.`);
        }
    }

    async function handleDelete(table, id) {
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            toast.success(`${table.replace('_', ' ')} deleted successfully`);
            fetchData(table);
        } catch (error) {
            console.error(`Error deleting ${table} item:`, error);
            toast.error(`Failed to delete ${table} item. Please try again.`);
        }
    }

    function renderForm(table) {
        const fields = getFields(table);
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    editingId ? handleUpdate(table, editingId) : handleCreate(table);
                }}
                className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{editingId ? 'Edit' : 'Create'} {table.replace('_', ' ')}</h2>
                {fields.map((field) => (
                    <div key={field} className="flex flex-col">
                        <label htmlFor={field} className="mb-2 text-sm font-medium text-gray-700">
                            {field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}
                        </label>
                        <input
                            id={field}
                            type={getInputType(field)} // Set type based on field name
                            placeholder={field.replace('_', ' ')}
                            value={newItem[field] || ''}
                            onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
                    {editingId ? 'Update' : 'Create'}
                </button>
            </form>
        );
    }

    function renderTable(table, data) {
        const fields = getFields(table);
        return (
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            {fields.map((field) => (
                                <th key={field} className="p-4 font-semibold text-gray-700 border-b">
                                    {field.replace('_', ' ').charAt(0).toUpperCase() + field.replace('_', ' ').slice(1)}
                                </th>
                            ))}
                            <th className="p-4 font-semibold text-gray-700 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition duration-200">
                                {fields.map((field) => (
                                    <td key={field} className="p-4 border-b">{item[field]}</td>
                                ))}
                                <td className="p-4 border-b">
                                    <button
                                        onClick={() => { setNewItem(item); setEditingId(item.id); }}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(table, item.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    function getFields(table) {
        switch (table) {
            case 'events':
                return ['title', 'date', 'time', 'location', 'description'];
            case 'clubs':
                return ['name', 'description', 'president', 'email'];
            case 'announcements':
                return ['title', 'content', 'date'];
            case 'gallery':
                return ['title', 'description', 'image_url'];
            case 'blog_posts':
                return ['title', 'content', 'author', 'image_url'];
            case 'attendees':
                return ['event_id', 'name', 'student_id'];
            case 'messages':
                return ['sender', 'recipient', 'content', 'timestamp'];
            case 'club_members':
                return ['club_id', 'student_id', 'role'];
            default:
                return [];
        }
    }

    function getInputType(field) {
        if (field === 'date') return 'date';
        if (field === 'time') return 'time';
        return 'text';
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
                <form onSubmit={handleLogin} className="bg-white p-10 rounded-xl shadow-2xl w-96 transform transition duration-500 hover:scale-105">
                    <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Login</h2>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 transform hover:scale-105"
                    >
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-extrabold text-center text-blue-600 mb-12 transform transition duration-500 hover:scale-105">Admin Dashboard</h1>
                <div className="flex flex-wrap justify-center mb-8 bg-white rounded-xl shadow-lg p-4">
                    {['events', 'clubs', 'announcements', 'gallery', 'blog_posts', 'attendees', 'messages', 'club_members'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`m-2 px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {tab.replace('_', ' ').charAt(0).toUpperCase() + tab.replace('_', ' ').slice(1)}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">{editingId ? 'Edit' : 'Create'} {activeTab.replace('_', ' ')}</h2>
                        {renderForm(activeTab)}
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">{activeTab.replace('_', ' ')} List</h2>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                {renderTable(activeTab, data)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
