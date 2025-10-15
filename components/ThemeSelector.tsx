
import React, { useState, useRef, useEffect } from 'react';
import { THEMES } from '../constants';
import { Theme } from '../types';

interface ThemeSelectorProps {
    currentTheme: Theme;
    onThemeChange: (themeName: string) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onThemeChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div ref={wrapperRef} className="fixed top-5 right-5 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition transform hover:scale-110"
                style={{ backgroundColor: 'var(--primary)' }}
            >
                <i className="fas fa-palette"></i>
            </button>
            {isOpen && (
                <div className="absolute top-14 right-0 p-4 rounded-xl shadow-xl grid grid-cols-3 gap-3" style={{ backgroundColor: 'var(--card-bg)'}}>
                    {THEMES.map(theme => (
                        <div
                            key={theme.name}
                            onClick={() => {
                                onThemeChange(theme.name);
                                setIsOpen(false);
                            }}
                            className={`w-10 h-10 rounded-lg cursor-pointer transition transform hover:scale-110 border-2 ${currentTheme.name === theme.name ? 'border-blue-500' : 'border-transparent'}`}
                            style={{ background: `linear-gradient(135deg, ${theme.colors['--bg-gradient-start']}, ${theme.colors['--bg-gradient-end']})` }}
                            title={theme.name.charAt(0).toUpperCase() + theme.name.slice(1)}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;
