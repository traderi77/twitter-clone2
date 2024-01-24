import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Input } from './ui/input';
import { FaSearchLocation } from 'react-icons/fa';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
  } from "@/components/ui/hover-card"
  

interface SearchBarProps {
    defaultSearchText?: string;
    onSearch: (searchText: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ defaultSearchText = '', onSearch }) => {
const [searchText, setSearchText] = useState(defaultSearchText);

    const handleSearch = () => {
        onSearch(searchText);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'k' && e.metaKey) {
            handleSearch();
        }
    };
    return (
            <div className='flex flex-row w-full justify-center'>
                <HoverCard>
                <HoverCardTrigger>
                    <Input 
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='text-neutral-500 w-80'
                        placeholder='Search for anything!'
                        icon={<FaSearchLocation className='text-neutral-500'/>}
                    />
                </HoverCardTrigger>
                <HoverCardContent className='w-80 h-120 scroll-m-0'>
                    testgin 
                </HoverCardContent>
                </HoverCard>



            </div>
    );
};



export default SearchBar;
