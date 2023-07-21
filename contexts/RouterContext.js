import { createContext, useState, useEffect } from 'react';

export const RouterContext = createContext();

export const RouterProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000); // 1 second delay
    }, []);

    return (
        <RouterContext.Provider value={{ loading }}>
            {children}
        </RouterContext.Provider>
    );
}