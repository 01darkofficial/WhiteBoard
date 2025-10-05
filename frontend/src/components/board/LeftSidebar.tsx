"use client"

export default function LeftSidebar() {
    return (
        <aside className="w-60 bg-white shadow-inner p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Drawing Tools (Coming Soon)</h2>
            <div className="flex flex-col space-y-2">
                <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Pencil</button>
                <button className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300">Shapes</button>
            </div>
        </aside>
    );
}
