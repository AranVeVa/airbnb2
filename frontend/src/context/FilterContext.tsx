'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
}

const FilterContext = createContext<FilterContextType>({
    showFilters: false,
    setShowFilters: () => { },
});

export function FilterProvider({ children }: { children: ReactNode }) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <FilterContext.Provider value={{ showFilters, setShowFilters }}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilters = () => useContext(FilterContext);