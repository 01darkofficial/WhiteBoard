

export interface User {
    _id: string;
    name: string;
    avatar: string;
    email: string;
}

export interface UserStore {
    user: User | null;
    loading: boolean;
    fetchUser: () => Promise<void>;
    setUser: (user: User | null) => void;
    clearUser: () => void;
}

export interface Member {
    user: string;
    permission: "read" | "write" | "admin";
}

export interface Board {
    _id: string;
    name: string;
    owner: string;
    members: Member[];
    createdAt: string;
    updatedAt: string;
}

export interface BoardState {
    boards: Board[];
    fetchBoards: (user: User) => Promise<void>;
    addBoard: (user: User, name: string) => Promise<void>;
    deleteBoard: (boardId: string) => Promise<void>;
}

export type ToolType = "pencil" | "eraser" | "circle" | "rectangle" | "line" | "stroke" | "text" | "sticky";

export interface BoardElement {
    _id: string
    board: Board;
    user: User;
    type: ToolType;
    data: any; // flexible for different element types
    createdAt: Date;
}

export interface BoardElementState {
    elements: BoardElement[];
    fetchElements: (user: User, boardId: string) => Promise<void>;
    addElement: (user: User, type: string, elementData: Partial<BoardElement>, boardId: string) => Promise<void>;
    removeElement: (user: User, elementId: string, boardId: string) => Promise<void>;
    addElementDirectly: (element: BoardElement) => void;
    updateElementDirectly: (elementId: string, changes: Partial<BoardElement>) => void;
    removeElementDirectly: (elementId: string,) => void;
}

export interface Notification extends Document {
    id: string,
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    relatedInvitation?: string;
    createdAt: Date;
    updatedAt: Date;
    timeAgo?: string; // Virtual field
}

export interface NotificationsState {
    notifications: Notification[];
    loading: Boolean,
    error: any,
    fetchNotifications: (unreadOnly: boolean, limit?: number) => Promise<void>;
    respondToNotification: (notificationId: string, response: string, userEmail: string) => Promise<void>;
    markRead: (notficationId: string) => Promise<void>;
    markAllRead: () => Promise<void>
}

export interface Invitation {
    board: string;          // Reference to the board
    invitee: string;        // User being invited
    inviter: string;        // User sending the invite
    role: 'viewer' | 'editor' | 'admin'; // Role in the board (editor/viewer/etc)
    boardPermissions: string[];      // Optional permissions
    status: "pending" | "accepted" | "rejected"; // Invitation status
    createdAt: Date;
    updatedAt: Date;
}

export interface AddMemberResponse {
    board: Board;
    invitation: Invitation;
}

export interface ToolState {
    tool: ToolType;
    color: string;
    thickness: number;
    setTool: (tool: ToolType) => void;
    setColor: (color: string) => void;
    setThickness: (thickness: number) => void;
}
