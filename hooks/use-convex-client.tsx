import { ConvexHttpClient } from 'convex/browser';
import React, { createContext, ReactNode, useContext } from 'react';

const ConvexClientContext = createContext<ConvexHttpClient | null>(null);

interface ConvexClientProviderProps {
    children: ReactNode;
}

export const ConvexClientProvider: React.FC<ConvexClientProviderProps> = ({ children }) => {
    const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
        throw new Error('Convex URL is not defined');
    }
    return (
        <ConvexClientContext.Provider value={client}>
            {children}
        </ConvexClientContext.Provider>
    );
};

export const useConvexClient = () => {
    const context = useContext(ConvexClientContext);
    if (!context) {
        throw new Error('useConvexClient must be used within a ConvexClientProvider');
    }
    return context;
};