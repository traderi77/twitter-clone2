import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';


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
            <div className=" w-full search-bar">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch}>
                    <BiSearch />
                </button>
            </div>
    );
};



export default SearchBar;
