'use client';

import { cn } from '@/lib/utils';
import { Clock, Filter, Search, TrendingUp, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'trending' | 'suggestion';
  category?: string;
  icon?: React.ReactNode;
}

export interface SearchFilter {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string, filters?: Record<string, string>) => void;
  suggestions?: SearchSuggestion[];
  filters?: SearchFilter[];
  recentSearches?: string[];
  trendingSearches?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'filled' | 'minimal';
  showSuggestions?: boolean;
  showFilters?: boolean;
  showRecentSearches?: boolean;
  showTrendingSearches?: boolean;
  disabled?: boolean;
  loading?: boolean;
  clearable?: boolean;
  searchOnEnter?: boolean;
  searchOnChange?: boolean;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  suggestions = [],
  filters = [],
  recentSearches = [],
  trendingSearches = [],
  className,
  size = 'md',
  variant = 'default',
  showSuggestions = true,
  showFilters = true,
  showRecentSearches = true,
  showTrendingSearches = true,
  disabled = false,
  loading = false,
  clearable = true,
  searchOnEnter = true,
  searchOnChange = false,
  debounceMs = 300,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce input
  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [inputValue, debounceMs]);

  // Trigger search on debounced change
  useEffect(() => {
    if (searchOnChange && debouncedValue !== value) {
      onSearch?.(debouncedValue, activeFilters);
    }
  }, [debouncedValue, searchOnChange, onSearch, activeFilters, value]);

  // Sync prop value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(newValue);
      setShowDropdown(true);
      setSelectedSuggestionIndex(-1);
    },
    [onChange]
  );

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
    setShowDropdown(true);
  }, []);

  const getTotalSuggestionsCount = useCallback(() => {
    let count = 0;
    if (showRecentSearches) count += recentSearches.length;
    if (showTrendingSearches) count += trendingSearches.length;
    if (showSuggestions) count += suggestions.length;
    return count;
  }, [
    showRecentSearches,
    recentSearches.length,
    showTrendingSearches,
    trendingSearches.length,
    showSuggestions,
    suggestions.length,
  ]);

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (searchOnEnter) {
          onSearch?.(inputValue, activeFilters);
          setShowDropdown(false);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          Math.min(prev + 1, getTotalSuggestionsCount() - 1)
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Escape') {
        setShowDropdown(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [
      inputValue,
      activeFilters,
      onSearch,
      searchOnEnter,
      getTotalSuggestionsCount,
    ]
  );

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion | string) => {
      const text =
        typeof suggestion === 'string' ? suggestion : suggestion.text;
      setInputValue(text);
      onChange?.(text);
      onSearch?.(text, activeFilters);
      setShowDropdown(false);
      setIsFocused(false);
    },
    [onChange, onSearch, activeFilters]
  );

  const handleFilterChange = useCallback(
    (filterId: string, filterValue: string) => {
      const newFilters = { ...activeFilters };
      if (filterValue) newFilters[filterId] = filterValue;
      else delete newFilters[filterId];
      setActiveFilters(newFilters);
      onSearch?.(inputValue, newFilters);
    },
    [activeFilters, inputValue, onSearch]
  );

  const handleClear = useCallback(() => {
    setInputValue('');
    onChange?.('');
    setActiveFilters({});
    inputRef.current?.focus();
  }, [onChange]);

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-14 text-lg',
  };

  const variantClasses = {
    default:
      'bg-white border border-gray-300 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    outlined:
      'bg-transparent border-2 border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    filled:
      'bg-gray-100 border border-transparent hover:bg-gray-200 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
    minimal:
      'bg-transparent border-b border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-0',
  };

  const iconSize = size === 'sm' ? 16 : size === 'md' ? 18 : 20;

  return (
    <div className={cn('relative w-full', className)}>
      {/* Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={iconSize} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-10 pr-20 rounded-lg transition-all duration-200 outline-none',
            sizeClasses[size],
            variantClasses[variant],
            disabled && 'opacity-50 cursor-not-allowed',
            isFocused && 'ring-2 ring-blue-500/20'
          )}
        />

        {/* Clear Button */}
        {clearable && inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={iconSize} />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={() => onSearch?.(inputValue, activeFilters)}
          disabled={disabled || loading}
          className={cn(
            'absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-black transition-colors',
            size === 'sm' ? 'h-7' : size === 'md' ? 'h-9' : 'h-12',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            'Search'
          )}
        </button>
      </div>

      {/* Filters */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={activeFilters[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && isFocused && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto"
        >
          {/* Recent */}
          {showRecentSearches && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Clock size={14} />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(search)}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors',
                    selectedSuggestionIndex === index &&
                      'bg-blue-50 text-blue-600'
                  )}
                >
                  {search}
                </button>
              ))}
            </div>
          )}

          {/* Trending */}
          {showTrendingSearches && trendingSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <TrendingUp size={14} />
                Trending
              </div>
              {trendingSearches.map((search, index) => {
                const globalIndex =
                  (showRecentSearches ? recentSearches.length : 0) + index;
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors',
                      selectedSuggestionIndex === globalIndex &&
                        'bg-blue-50 text-blue-600'
                    )}
                  >
                    {search}
                  </button>
                );
              })}
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="p-3">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Suggestions
              </div>
              {suggestions.map((suggestion, index) => {
                const globalIndex =
                  (showRecentSearches ? recentSearches.length : 0) +
                  (showTrendingSearches ? trendingSearches.length : 0) +
                  index;
                return (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors',
                      selectedSuggestionIndex === globalIndex &&
                        'bg-blue-50 text-blue-600'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {suggestion.icon}
                      <div className="flex-1">
                        <div className="text-gray-900">{suggestion.text}</div>
                        {suggestion.category && (
                          <div className="text-xs text-gray-500">
                            {suggestion.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {getTotalSuggestionsCount() === 0 && (
            <div className="p-6 text-center text-gray-500">
              <Search size={24} className="mx-auto mb-2 text-gray-300" />
              <p>No suggestions available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const CompanySearchBar: React.FC<
  Omit<SearchBarProps, 'variant' | 'size'>
> = (props) => (
  <SearchBar
    {...props}
    variant="default"
    size="md"
    showSuggestions
    showFilters
    showRecentSearches
    showTrendingSearches
  />
);

export const SimpleSearchBar: React.FC<
  Omit<SearchBarProps, 'variant' | 'size'>
> = (props) => (
  <SearchBar
    {...props}
    variant="minimal"
    size="md"
    showSuggestions={false}
    showFilters={false}
    showRecentSearches={false}
    showTrendingSearches={false}
  />
);

export const CompactSearchBar: React.FC<
  Omit<SearchBarProps, 'variant' | 'size'>
> = (props) => (
  <SearchBar
    {...props}
    variant="outlined"
    size="sm"
    showSuggestions
    showFilters={false}
    showRecentSearches
    showTrendingSearches={false}
  />
);

export default SearchBar;
