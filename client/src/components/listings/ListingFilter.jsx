import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Input, Badge, Button } from '../ui';
import { WORK_MODES, POPULAR_TAGS } from '../../constants';
import { cn } from '../../lib/cn';

// Simple debounce custom hook mapping
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const ListingFilter = ({ isMobileOpen, onCloseMobile }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(localSearch, 400);

    // Accordion state
    const [workModeOpen, setWorkModeOpen] = useState(true);
    const [tagsOpen, setTagsOpen] = useState(true);

    // Read current filters from URL mapping arrays natively
    const currentWorkModes = searchParams.getAll('workMode');
    const currentTags = searchParams.getAll('tags');

    // Push debounced search to URL cleanly without wiping other params natively
    useEffect(() => {
        if (debouncedSearch !== searchParams.get('search')) {
            const newParams = new URLSearchParams(searchParams);
            if (debouncedSearch) {
                newParams.set('search', debouncedSearch);
            } else {
                newParams.delete('search');
            }
            setSearchParams(newParams);
        }
        // eslint-disable-next-line
    }, [debouncedSearch]);

    const toggleWorkMode = (mode) => {
        const newParams = new URLSearchParams(searchParams);
        if (currentWorkModes.includes(mode)) {
            const modesList = newParams.getAll('workMode').filter(m => m !== mode);
            newParams.delete('workMode');
            modesList.forEach(m => newParams.append('workMode', m));
        } else {
            newParams.append('workMode', mode);
        }
        setSearchParams(newParams);
    };

    const toggleTag = (tag) => {
        const newParams = new URLSearchParams(searchParams);
        if (currentTags.includes(tag)) {
            const tagsList = newParams.getAll('tags').filter(t => t !== tag);
            newParams.delete('tags');
            tagsList.forEach(t => newParams.append('tags', t));
        } else {
            newParams.append('tags', tag);
        }
        setSearchParams(newParams);
    };

    const clearAll = () => {
        setLocalSearch('');
        setSearchParams(new URLSearchParams());
    };

    const activeFiltersCount = currentWorkModes.length + currentTags.length + (localSearch ? 1 : 0);

    const FilterContent = () => (
        <div className="flex flex-col gap-6 p-4 md:p-0">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
                    >
                        Clear all ({activeFiltersCount})
                    </button>
                )}
            </div>

            {/* Search Input */}
            <div>
                <Input
                    placeholder="Search roles, companies..."
                    icon={Search}
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="bg-gray-50 focus:bg-white"
                />
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Work Mode */}
            <div>
                <button
                    className="flex w-full items-center justify-between py-2 mb-2 focus:outline-none"
                    onClick={() => setWorkModeOpen(!workModeOpen)}
                >
                    <span className="font-medium text-sm text-gray-900">Work Mode</span>
                    {workModeOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {workModeOpen && (
                    <div className="space-y-3 pt-2 pl-1">
                        {WORK_MODES.map(mode => (
                            <label key={mode} className="flex items-center group cursor-pointer">
                                <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                                    <input
                                        type="checkbox"
                                        checked={currentWorkModes.includes(mode)}
                                        onChange={() => toggleWorkMode(mode)}
                                        className="peer appearance-none w-5 h-5 border border-gray-300 rounded checked:bg-black checked:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 transition-all"
                                    />
                                    <X className={cn("absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity")} />
                                </div>
                                <span className="text-sm text-gray-600 capitalize group-hover:text-black transition-colors">{mode}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Tags */}
            <div>
                <button
                    className="flex w-full items-center justify-between py-2 mb-2 focus:outline-none"
                    onClick={() => setTagsOpen(!tagsOpen)}
                >
                    <span className="font-medium text-sm text-gray-900">Popular Skills</span>
                    {tagsOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {tagsOpen && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {POPULAR_TAGS.map(tag => {
                            const isSelected = currentTags.includes(tag);
                            return (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={cn(
                                        "text-xs px-2.5 py-1.5 rounded-full border transition-all focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 font-medium",
                                        isSelected
                                            ? "bg-black border-black text-white hover:bg-gray-900"
                                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-black"
                                    )}
                                >
                                    {tag}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0 sticky top-20">
                <FilterContent />
            </div>

            {/* Mobile Drawer Mapping properly */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onCloseMobile} />
                    <div className="relative flex w-full max-w-xs flex-col bg-white overflow-y-auto z-50 animate-slide-right">
                        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                            <button onClick={onCloseMobile} className="p-2 text-gray-500 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <FilterContent />
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                            <Button className="w-full shadow-sm" onClick={onCloseMobile}>Show Results</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
