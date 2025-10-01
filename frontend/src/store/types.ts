

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