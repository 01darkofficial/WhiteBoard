"use client";

interface ModalProps {
    title: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, children, isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose} // close when clicking on the backdrop
        >
            <div
                className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
                {children}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
                >
                    ×
                </button>
            </div>
        </div>
    );
}
