'use client'

import { useState, useRef } from 'react';
import styles from './SearchBar.module.css';

const SearchBar = ({onSearchChange, onGoBackInSearch}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleSearchChange = (event) => {
    const text = event.target.value;
    setSearchQuery(text);
    onSearchChange(text);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Backspace' && searchQuery === '') {
      onGoBackInSearch();
    }
  };

  return (
    <div className={styles.searchBarContainer}>
      <input
        ref={searchInputRef}
        className={styles.searchBarInput}
        placeholder="Search for a food item..."
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        type="search"
      />
    </div>
  );
};

export default SearchBar;
