import React from 'react';

function PopupModal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
            <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-screen p-6 overflow-auto">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={onClose}
                >
                    ✖
                </button>
                <h2 className="text-3xl font-bold mb-4 text-gray-800">{title}</h2>
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PopupModal;
