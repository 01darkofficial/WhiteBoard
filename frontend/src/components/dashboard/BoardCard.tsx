// /components/dashboard/BoardCard.tsx
interface BoardCardProps {
    id: string;
    name: string;
    createdAt: string;
    membersCount: number;
    onClick: (id: string) => void;
}

export default function BoardCard({ id, name, createdAt, membersCount, onClick }: BoardCardProps) {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm mb-2">Created: {createdAt}</p>
            <p className="text-gray-500 text-sm mb-4">Active Users: {membersCount}</p>
            <button
                onClick={() => onClick(id)}
                className="mt-auto px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full hover:bg-emerald-200 transition font-medium"
            >
                Join Board
            </button>
        </div>
    );
}
