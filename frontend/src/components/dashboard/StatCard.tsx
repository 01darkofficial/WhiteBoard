// /components/dashboard/StatCard.tsx
interface StatCardProps {
    title: string;
    value: string | number;
}

export default function StatCard({ title, value }: StatCardProps) {
    return (
        <div className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-xl font-bold text-emerald-500">{value}</h2>
        </div>
    );
}
