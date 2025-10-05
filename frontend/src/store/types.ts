

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

export interface BoardElement {
    _id: string
    board: Board;
    user: User;
    type: "stroke" | "shape" | "text" | "sticky";
    data: any; // flexible for different element types
    createdAt: Date;
}

export interface BoardElementState {
    elements: BoardElement[];
    fetchElements: (user: User, boardId: string) => Promise<void>;
    addElement: (user: User, type: string, elementData: Partial<BoardElement>, boardId: string) => Promise<void>;
    removeElement: (user: User, elementId: string, boardId: string) => Promise<void>;
}