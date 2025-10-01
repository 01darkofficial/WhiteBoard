interface CardProps {
    title: string;
    value: string | number;
    description?: string;
}

export default function Card({ title, value, description }: CardProps) {
    return (
        <div className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-xl font-bold text-emerald-500">{value}</h2>
            {description && <p className="text-gray-400 text-xs">{description}</p>}
        </div>
    );
}
