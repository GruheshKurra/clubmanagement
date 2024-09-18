import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-primary-50 text-primary-800">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-primary-700">Student Club Management System</h3>
                        <p className="text-sm">Enhancing student engagement and club management efficiency.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-primary-700">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-sm hover:text-primary-600 transition-colors duration-300">Home</Link></li>
                            <li><Link to="/events" className="text-sm hover:text-primary-600 transition-colors duration-300">Events</Link></li>
                            <li><Link to="/club-directory" className="text-sm hover:text-primary-600 transition-colors duration-300">Clubs</Link></li>
                            <li><Link to="/dashboard" className="text-sm hover:text-primary-600 transition-colors duration-300">Dashboard</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-primary-700">Contact Us</h3>
                        <p className="text-sm">Email: info@scms.edu</p>
                        <p className="text-sm">Phone: (123) 456-7890</p>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm border-t border-primary-200 pt-4">
                    <p>&copy; 2024 Student Club Management System. All rights reserved.</p>
                    <p className="mt-2">Developed by: B.PRANITHA, K.SRUJANA REDDY, Y.PUSHKALA</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;