import { createContext, ReactNode, useContext, useState } from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
};

const AuthContext = 
    createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children, }: {children: ReactNode})
{
    const [user, setUser] = useState<User | null>(null);

    const login = () => {
        setUser({
            id: 1,
            name: 'Usuario de prueba',
            email: 'usuario@buscafe.com',
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: user !== null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth()
{
    const context = useContext(AuthContext);

    if(!context)
    {
        throw new Error(
            'useAuth debe usarse dentro de AuthProvider'
        );
    }

    return context;
}