"use client"

interface Member {
    name: string;
    active: boolean;
}

interface RightSidebarProps {
    members: Member[];
}

export default function RightSidebar({ members }: RightSidebarProps) {
    const activeMembers = members.filter(m => m.active);
    const inactiveMembers = members.filter(m => !m.active);

    return (
        <aside className="w-60 bg-white shadow-inner p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Members</h2>
            <div className="flex flex-col space-y-2">
                {activeMembers.map((m, idx) => (
                    <div key={idx} className="px-3 py-2 bg-green-100 rounded font-medium">
                        {m.name} (Active)
                    </div>
                ))}
                {inactiveMembers.map((m, idx) => (
                    <div key={idx} className="px-3 py-2 bg-gray-100 rounded">
                        {m.name} (Inactive)
                    </div>
                ))}
            </div>
        </aside>
    );
}
