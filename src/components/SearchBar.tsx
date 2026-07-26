'use client';

import { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

interface Suggestion {
  name: string;
  country: string;
  state: string;
  display: string;
}

export default function SearchBar({ onSearch, isLoading, initialValue = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searched, setSearchStatus] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [autoLocationStatus, setAutoLocationStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasAutoSearched = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation || hasAutoSearched.current) return;
    hasAutoSearched.current = true;
    setAutoLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(`/api/reverse-geocode?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
          const data = await res.json();
          if (data && (data.name || data.display)) {
            const display = [data.name, data.state, data.country].filter(Boolean).join(', ');
            setSearchStatus(true);
            setQuery(display);
            onSearch(display);
          }
        } catch {
          // silently ignore reverse geocode failure
        } finally {
          setAutoLocationStatus('done');
        }
      },
      () => {
        setAutoLocationStatus('error');
      }
    );
  }, [onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideSearch = containerRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);
      if (clickedInsideSearch || clickedInsideDropdown) return;
      setShowSuggestions(false);
      setSearchStatus(false);
      setSuggestions([]);
      setDropdownRect(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2 && !searched) {
        fetch(`/api/geocode?q=${encodeURIComponent(query.trim())}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data);
            setActiveIndex(-1);
            if (data.length > 0 && inputRef.current) {
              const rect = inputRef.current.getBoundingClientRect();
              setDropdownRect({ top: rect.bottom + 8, left: rect.left, width: rect.width });
              setShowSuggestions(true);
            } else {
              setShowSuggestions(false);
              setDropdownRect(null);
            }
          })
          .catch(() => {
            setSuggestions([]);
            setShowSuggestions(false);
            setDropdownRect(null);
          });
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setDropdownRect(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const selectSuggestion = useCallback(
    (display: string) => {
      setSearchStatus(true);
      setQuery(display);
      setShowSuggestions(false);
      setSuggestions([]);
      setDropdownRect(null);
      onSearch(display);
    },
    [onSearch]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        setShowSuggestions(false);
        setSuggestions([]);
        setDropdownRect(null);
        onSearch(trimmed);
      }
    },
    [query, onSearch]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      setSearchStatus(false);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          selectSuggestion(suggestions[activeIndex].display);
        } else {
          handleSubmit(e);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    },
    [suggestions, activeIndex, selectSuggestion, handleSubmit]
  );

  const handleClear = useCallback(() => {
    setSearchStatus(false);
    setQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
    setDropdownRect(null);
    inputRef.current?.focus();
  }, []);

  const suggestionsDropdown = (showSuggestions && mounted && dropdownRect) ? (
    <div
      ref={dropdownRef}
      className="fixed inset-0 z-[9999]"
    >
      <ul
        className="animate-fade-in bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden divide-y divide-white/5"
        role="listbox"
        style={{ position: 'fixed', top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width }}
      >
        {suggestions.map((item, index) => (
          <li
            key={`${item.display}-${index}`}
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => selectSuggestion(item.display)}
            className={`px-5 py-3.5 text-left text-sm cursor-pointer transition-all duration-200 flex items-center gap-3 ${
              index === activeIndex ? 'bg-white/15 text-white scale-[1.01]' : 'text-white/80 hover:bg-white/10 hover:translate-x-0.5'
            }`}
          >
            <svg
              className="size-4 flex-shrink-0 opacity-70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243A8 8 0 1117.657 16.657z"
              />
              <circle cx="12" cy="11" r="1.5" fill="currentColor" />
            </svg>
            <div className="flex flex-col">
              <span className="font-medium leading-tight">{item.name}</span>
              <span className="text-xs text-white/50 leading-tight">
                {[item.state, item.country].filter(Boolean).join(', ') || 'Unknown location'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  ) : "";

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/30 to-white/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center bg-slate-900/40 backdrop-blur-xl rounded-full border border-white/20 focus-within:border-white/50 transition-all duration-300 overflow-hidden shadow-2xl shadow-black/20">
            <svg
              className="size-6 ml-5 fill-white/50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <title>magnify</title>
              <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for a city..."
              className="flex-1 bg-transparent px-4 py-4 text-white placeholder-white/40 outline-none text-base sm:text-lg font-light tracking-wide"
              aria-label="Search city"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="mr-2 p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="mr-1.5 px-5 py-2.5 bg-white/20 hover:bg-white/30 disabled:bg-white/5 disabled:text-white/20 text-white font-medium rounded-full transition-all duration-300 flex-shrink-0 backdrop-blur-sm border border-white/10 hover:border-white/20"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg
                  className="size-6 fill-white/60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>magnify</title>
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
      {mounted && typeof document !== 'undefined' && createPortal(suggestionsDropdown, document.body)}
    </>
  );
}
