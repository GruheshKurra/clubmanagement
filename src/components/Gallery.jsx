import React, { useState, useEffect } from 'react';

function Gallery({ supabase }) {
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchGallery();
    }, []);

    // Fetch gallery images from Supabase
    async function fetchGallery() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('id', { ascending: true }); // Order by 'id'

            if (error) throw error;
            setGalleryImages(data || []);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setError('Failed to load gallery.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="text-center py-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-20">{error}</div>;
    }

    return (
        <div className="container mx-auto py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Gallery</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.length > 0 ? (
                    galleryImages.map((image) => (
                        <div key={image.id} className="bg-white rounded-lg shadow-lg">
                            <img
                                src={image.image_url}
                                alt={image.title}
                                className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-bold">{image.title}</h2>
                                <p className="text-gray-600">{image.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No gallery images available.</p>
                )}
            </div>
        </div>
    );
}

export default Gallery;
