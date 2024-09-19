// src/components/NotFound.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex justify-center items-center h-screen flex-col">
            <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
            <p className="text-lg text-gray-700 mb-8">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="text-blue-600 hover:underline">Go back to home</Link>
        </div>
    );
}

export default NotFound;
