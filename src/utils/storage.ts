import { LocationInfo } from '../types/weather';

const RECENT_SEARCHES_KEY = 'weather-app-recent-searches';
const UNITS_KEY = 'weather-app-units';

// Save a location to recent searches
export const saveRecentSearch = (location: LocationInfo): void => {
  try {
    const recentSearches = getRecentSearches();
    
    // Check if location already exists
    const existingIndex = recentSearches.findIndex(
      (item) => 
        item.name === location.name && 
        item.country === location.country
    );
    
    // If exists, remove it so we can add to top
    if (existingIndex !== -1) {
      recentSearches.splice(existingIndex, 1);
    }
    
    // Add to beginning of array
    recentSearches.unshift(location);
    
    // Keep only the most recent 5 searches
    const limitedSearches = recentSearches.slice(0, 5);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limitedSearches));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
};

// Get recent searches from local storage
export const getRecentSearches = (): LocationInfo[] => {
  try {
    const searches = localStorage.getItem(RECENT_SEARCHES_KEY);
    return searches ? JSON.parse(searches) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
};

// Save units preference
export const saveUnits = (isMetric: boolean): void => {
  try {
    localStorage.setItem(UNITS_KEY, JSON.stringify({ isMetric }));
  } catch (error) {
    console.error('Error saving units preference:', error);
  }
};

// Get units preference
export const getUnitsPreference = (): boolean => {
  try {
    const units = localStorage.getItem(UNITS_KEY);
    return units ? JSON.parse(units).isMetric : true; // Default to metric
  } catch (error) {
    console.error('Error getting units preference:', error);
    return true; // Default to metric
  }
};