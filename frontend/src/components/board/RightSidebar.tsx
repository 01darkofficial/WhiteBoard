"use client";
import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/chatStore";
import { Member } from "@/store/types";
import { useBoardSocket, emitUpdateChats, emitUpdateMembers } from "@/hooks/useBoardSocket";

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
    const addMessageDirectly = useChatStore((s) => s.addMessageDirectly);

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
    useEffect(() => {
        if (boardId) {
            fetchMessages(boardId);
        }
    }, [boardId]);

    // const activeMembers = members.filter((m) => m?.active);
    // const inactiveMembers = members.filter((m) => !m?.active);

    const boardSocket = useBoardSocket(boardId, {
        onChatsUpdated: (data) => {
            addMessageDirectly(data.changes);
        },
    });

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        addMessage(boardId, username!, inputText); // store handles API
        const newMessage = {
            _id: crypto.randomUUID(),
            userId: userId,
            username,
            msg: inputText,
            timestamp: Date.now(),
        };
        emitUpdateChats(boardSocket, boardId, newMessage)
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
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 mb-2 rounded-xl shadow-sm bg-white border border-gray-200 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar circle */}
                                {/* <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-200 text-green-700 font-semibold">
                                    {m?.user.name.charAt(0).toUpperCase()}
                                </div> */}

                                {/* User info */}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800 text-sm">
                                        {m?.user.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {m?.role}
                                    </span>
                                </div>
                            </div>

                            {/* Status badge */}
                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Active
                            </div>
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
