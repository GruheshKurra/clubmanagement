import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

function AdminPage({ supabase }) {
    const [events, setEvents] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', duration: '', location: '', description: '' });
    const [newClub, setNewClub] = useState({ name: '', category: '', member_count: '', description: '' });
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [newGalleryItem, setNewGalleryItem] = useState({ title: '', description: '', image: null });
    const [newBlogPost, setNewBlogPost] = useState({ title: '', content: '', image: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('events');

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
                fetchAnnouncements(),
                fetchGalleryItems(),
                fetchBlogPosts()
            ]);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }

    async function fetchEvents() {
        const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (error) throw error;
        setEvents(data || []);
    }

    async function fetchClubs() {
        const { data, error } = await supabase.from('clubs').select('*');
        if (error) throw error;
        setClubs(data || []);
    }

    async function fetchAnnouncements() {
        const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setAnnouncements(data || []);
    }

    async function fetchGalleryItems() {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setGalleryItems(data || []);
    }

    async function fetchBlogPosts() {
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setBlogPosts(data || []);
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

    async function handleGallerySubmit(e) {
        e.preventDefault();
        try {
            if (!newGalleryItem.image) {
                throw new Error('Please select an image');
            }

            const file = newGalleryItem.image;
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `gallery/${fileName}`;

            // Upload image to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get public URL of uploaded image
            const { data: { publicUrl }, error: urlError } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);

            if (urlError) throw urlError;

            // Insert gallery item into database
            const { data, error } = await supabase.from('gallery').insert([
                { ...newGalleryItem, image_url: publicUrl }
            ]);

            if (error) throw error;

            toast.success('Gallery item added successfully');
            fetchGalleryItems();
            setNewGalleryItem({ title: '', description: '', image: null });
        } catch (err) {
            console.error('Error adding gallery item:', err);
            toast.error('Failed to add gallery item');
        }
    }

    async function handleBlogPostSubmit(e) {
        e.preventDefault();
        try {
            let imageUrl = null;

            if (newBlogPost.image) {
                const file = newBlogPost.image;
                const fileExt = file.name.split('.').pop();
                const fileName = `${uuidv4()}.${fileExt}`;
                const filePath = `blog/${fileName}`;

                // Upload image to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // Get public URL of uploaded image
                const { data: { publicUrl }, error: urlError } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (urlError) throw urlError;

                imageUrl = publicUrl;
            }

            // Insert blog post into database
            const { data, error } = await supabase.from('blog_posts').insert([
                { ...newBlogPost, image_url: imageUrl }
            ]);

            if (error) throw error;

            toast.success('Blog post added successfully');
            fetchBlogPosts();
            setNewBlogPost({ title: '', content: '', image: null });
        } catch (err) {
            console.error('Error adding blog post:', err);
            toast.error('Failed to add blog post');
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
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return (
            <div className="text-center text-red-600 p-4">
                <p className="text-xl font-semibold mb-4">{error}</p>
                <button
                    onClick={fetchAllData}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="admin-page space-y-8 p-4 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex flex-wrap border-b">
                    <TabButton active={activeTab === 'events'} onClick={() => setActiveTab('events')}>Manage Events</TabButton>
                    <TabButton active={activeTab === 'clubs'} onClick={() => setActiveTab('clubs')}>Manage Clubs</TabButton>
                    <TabButton active={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')}>Manage Announcements</TabButton>
                    <TabButton active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')}>Manage Gallery</TabButton>
                    <TabButton active={activeTab === 'blog'} onClick={() => setActiveTab('blog')}>Manage Blog</TabButton>
                </div>

                <div className="p-6">
                    {activeTab === 'events' && (
                        <EventsSection
                            events={events}
                            newEvent={newEvent}
                            setNewEvent={setNewEvent}
                            handleEventSubmit={handleEventSubmit}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'clubs' && (
                        <ClubsSection
                            clubs={clubs}
                            newClub={newClub}
                            setNewClub={setNewClub}
                            handleClubSubmit={handleClubSubmit}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'announcements' && (
                        <AnnouncementsSection
                            announcements={announcements}
                            newAnnouncement={newAnnouncement}
                            setNewAnnouncement={setNewAnnouncement}
                            handleAnnouncementSubmit={handleAnnouncementSubmit}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'gallery' && (
                        <GallerySection
                            galleryItems={galleryItems}
                            newGalleryItem={newGalleryItem}
                            setNewGalleryItem={setNewGalleryItem}
                            handleGallerySubmit={handleGallerySubmit}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'blog' && (
                        <BlogSection
                            blogPosts={blogPosts}
                            newBlogPost={newBlogPost}
                            setNewBlogPost={setNewBlogPost}
                            handleBlogPostSubmit={handleBlogPostSubmit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
                <StatCard title="Total Events" value={events.length} />
                <StatCard title="Total Clubs" value={clubs.length} />
                <StatCard title="Total Announcements" value={announcements.length} />
                <StatCard title="Gallery Items" value={galleryItems.length} />
                <StatCard title="Blog Posts" value={blogPosts.length} />
            </div>

            {/* Refresh Data Button */}
            <div className="text-center mt-8">
                <button
                    onClick={fetchAllData}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors duration-300"
                >
                    Refresh All Data
                </button>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, children }) {
    return (
        <button
            className={`flex-1 py-2 px-4 text-center ${active ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-3xl font-bold text-blue-500">{value}</p>
        </div>
    );
}

function EventsSection({ events, newEvent, setNewEvent, handleEventSubmit, handleDelete }) {
    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Events</h2>
            <form onSubmit={handleEventSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Event Title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-800"
                        required
                    />
                    <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded text-gray-800"
                        required
                    />
                </div>
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                ></textarea>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">
                    Add Event
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Title</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Time</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} className="border-b border-gray-200">
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
        </>
    );
}

function ClubsSection({ clubs, newClub, setNewClub, handleClubSubmit, handleDelete }) {
    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Clubs</h2>
            <form onSubmit={handleClubSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Club Name"
                    value={newClub.name}
                    onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newClub.category}
                    onChange={(e) => setNewClub({ ...newClub, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <input
                    type="number"
                    placeholder="Member Count"
                    value={newClub.member_count}
                    onChange={(e) => setNewClub({ ...newClub, member_count: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={newClub.description}
                    onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                ></textarea>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">
                    Add Club
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Name</th>
                            <th className="p-2">Category</th>
                            <th className="p-2">Members</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map(club => (
                            <tr key={club.id} className="border-b border-gray-200">
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
        </>
    );
}

function AnnouncementsSection({ announcements, newAnnouncement, setNewAnnouncement, handleAnnouncementSubmit, handleDelete }) {
    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Announcements</h2>
            <form onSubmit={handleAnnouncementSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Announcement Title"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <textarea
                    placeholder="Content"
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                ></textarea>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">
                    Add Announcement
                </button>
            </form>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">Title</th>
                            <th className="p-2">Content</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map(announcement => (
                            <tr key={announcement.id} className="border-b border-gray-200">
                                <td className="p-2">{announcement.title}</td>
                                <td className="p-2">{announcement.content.substring(0, 50)}...</td>
                                <td className="p-2">{new Date(announcement.created_at).toLocaleDateString()}</td>
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
        </>
    );
}

function GallerySection({ galleryItems, newGalleryItem, setNewGalleryItem, handleGallerySubmit, handleDelete }) {
    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Gallery</h2>
            <form onSubmit={handleGallerySubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Image Title"
                    value={newGalleryItem.title}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <textarea
                    placeholder="Description"
                    value={newGalleryItem.description}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, description: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                ></textarea>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, image: e.target.files[0] })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">
                    Add Gallery Item
                </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleryItems.map(item => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                            <p className="text-gray-600 mb-4">{item.description}</p>
                            <button onClick={() => handleDelete('gallery', item.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function BlogSection({ blogPosts, newBlogPost, setNewBlogPost, handleBlogPostSubmit, handleDelete }) {
    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Blog Posts</h2>
            <form onSubmit={handleBlogPostSubmit} className="space-y-4 mb-6">
                <input
                    type="text"
                    placeholder="Blog Post Title"
                    value={newBlogPost.title}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                />
                <textarea
                    placeholder="Content"
                    value={newBlogPost.content}
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                    required
                ></textarea>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewBlogPost({ ...newBlogPost, image: e.target.files[0] })}
                    className="w-full p-2 border border-gray-300 rounded text-gray-800"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-300">
                    Add Blog Post
                </button>
            </form>
            <div className="space-y-4">
                {blogPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.content.substring(0, 100)}...</p>
                        {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover mb-4" />}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
                            <button onClick={() => handleDelete('blog_posts', post.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-300">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default AdminPage;