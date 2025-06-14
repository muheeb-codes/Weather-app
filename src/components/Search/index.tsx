import React, { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, MapPin, Clock } from 'lucide-react';
import { geocodeCity } from '../../utils/api';
import { LocationInfo } from '../../types/weather';
import { getRecentSearches } from '../../utils/storage';

interface SearchProps {
  onLocationSelect: (location: LocationInfo) => void;
  onUseGeolocation: () => void;
  isLoading: boolean;
}

const Search: React.FC<SearchProps> = ({ onLocationSelect, onUseGeolocation, isLoading }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<LocationInfo[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from local storage
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setSearchError(null);
      const location = await geocodeCity(query);
      
      if (location) {
        onLocationSelect(location);
        setQuery('');
        setShowDropdown(false);
      } else {
        setSearchError('Location not found. Please try another search.');
      }
    } catch (error) {
      setSearchError('Error searching for location. Please try again.');
      console.error('Search error:', error);
    }
  };

  const handleRecentSearchClick = (location: LocationInfo) => {
    onLocationSelect(location);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 pl-10 pr-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-white placeholder-white/70 transition-all"
            disabled={isLoading}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
          
          <button
            type="button"
            onClick={onUseGeolocation}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors"
            title="Use current location"
            disabled={isLoading}
          >
            <MapPin size={18} />
          </button>
        </div>
      </form>

      {searchError && (
        <div className="mt-2 text-red-400 text-sm font-medium px-3 py-2 bg-red-500/10 rounded-lg backdrop-blur-sm">
          {searchError}
        </div>
      )}

      {showDropdown && recentSearches.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden z-10 shadow-lg"
        >
          <div className="p-2 text-xs text-white/70 font-medium flex items-center gap-1">
            <Clock size={14} />
            Recent searches
          </div>
          <div className="max-h-60 overflow-y-auto">
            {recentSearches.map((location, index) => (
              <button
                key={`${location.name}-${location.country}-${index}`}
                onClick={() => handleRecentSearchClick(location)}
                className="w-full px-4 py-2 text-left text-white hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <MapPin size={16} className="text-blue-400" />
                <div>
                  <span className="font-medium">{location.name}</span>
                  <span className="text-white/70 text-sm ml-1">{location.country}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;