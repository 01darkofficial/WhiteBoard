"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { Member } from "@/store/types";

interface RightSidebarProps {
    members: (Member | undefined)[];
    boardId: string; // Pass boardId for API integration
    username: string | undefined;
    userId: string | undefined;
}

export default function RightSidebar({ members, boardId, username, userId }: RightSidebarProps) {
    const [dividerY, setDividerY] = useState(250);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const [inputText, setInputText] = useState("");

    const chatMessages = useChatStore((s) => s.messages);
    const fetchMessages = useChatStore((s) => s.fetchMessages);
    const addMessage = useChatStore((s) => s.addMessage);

    // --- Divider drag handlers ---
    const handleMouseDown = () => (isDragging.current = true);
    const handleMouseUp = () => (isDragging.current = false);

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current || !sidebarRef.current) return;
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const offsetY = e.clientY - sidebarRect.top;

        const minMembersHeight = 120;
        const minChatHeight = 200;

        const newHeight = Math.min(
            Math.max(offsetY, minMembersHeight),
            sidebarRect.height - minChatHeight
        );

        setDividerY(newHeight);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    // --- Fetch messages on load ---
    console.log("members : ", members)
    useEffect(() => {
        if (boardId) {
            fetchMessages(boardId);
        }
    }, [boardId]);

    // const activeMembers = members.filter((m) => m?.active);
    // const inactiveMembers = members.filter((m) => !m?.active);

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        addMessage(boardId, username!, inputText); // store handles API
        setInputText(""); // clear input
    };

    return (
        <aside
            ref={sidebarRef}
            className="w-72 bg-white shadow-inner flex flex-col border-l border-gray-300 h-full select-none"
        >
            {/* Members Section */}
            <div className="overflow-auto p-3" style={{ height: dividerY }}>
                <h2 className="text-lg font-semibold mb-3">Members</h2>
                <div className="flex flex-col space-y-2">
                    {members.map((m, idx) => (
                        <div key={idx} className="px-3 py-2 bg-green-100 rounded font-bold text-sm">
                            {m?.user.name} (Active)
                        </div>
                    ))}
                    {/* {inactiveMembers.map((m, idx) => (
                        <div key={idx} className="px-3 py-2 bg-gray-100 rounded">
                            {m?.name} (Inactive)
                        </div>
                    ))} */}
                </div>
            </div>

            {/* Divider */}
            <div
                onMouseDown={handleMouseDown}
                className="h-2 bg-gray-300 hover:bg-gray-400 cursor-row-resize"
            />

            {/* Chat Section */}
            <div className="flex-1 overflow-hidden bg-gray-50 p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-3">Chat</h2>

                {/* Chat container */}
                <div className="flex-1 min-h-0 overflow-y-auto bg-white rounded-2xl shadow-sm p-3 flex flex-col">
                    {(chatMessages || []).map((msg) => {
                        const isMe = msg.userId === userId; // current logged-in user
                        return (
                            <div
                                key={msg._id}
                                className={`flex flex-col max-w-[80%] mb-2 ${isMe ? "ml-auto items-end" : "mr-auto items-start"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded-md break-words ${isMe ? "bg-blue-100" : "bg-gray-100"
                                        }`}
                                >
                                    {msg.msg}
                                </div>
                                <span className="text-xs text-gray-500 mt-1">
                                    {isMe ? "You" : msg.username}
                                </span>
                            </div>
                        );
                    })}
                </div>


                {/* Chat input */}
                <div className="mt-2 flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 min-w-0 p-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") handleSendMessage();
                        }}
                    />
                    <button
                        className="flex-shrink-0 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                        onClick={handleSendMessage}
                    >
                        Send
                    </button>
                </div>

            </div>
        </aside>
    );
}
