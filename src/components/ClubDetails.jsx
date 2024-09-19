// src/components/ClubDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ClubDetails({ supabase }) {
    const { id } = useParams(); // Get club ID from the URL
    const [club, setClub] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClub = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('clubs')
                    .select('*')
                    .eq('id', id) // Fetch the specific club by ID
                    .single();

                if (error) {
                    throw error;
                }
                setClub(data);
            } catch (error) {
                setError('Failed to load club details.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchClub();
    }, [id, supabase]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading club details...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (!club) {
        return <div className="text-center text-gray-500 mt-10">Club not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-4">{club.name}</h1>
            <p className="text-lg mb-6">{club.description}</p>
            <p className="text-md text-gray-600">President: {club.president}</p>
            <p className="text-md text-gray-600">Email: {club.email}</p>
            <p className="text-md text-gray-600">Category: {club.category}</p>
            {/* Add more club-specific information here */}
        </div>
    );
}

export default ClubDetails;
