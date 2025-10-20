'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
    pageName: string;
    onBack?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ pageName, onBack }) => {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            // Use custom onBack if provided
            onBack();
        } else {
            // Default behavior: navigate back in history
            router.back();
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'transparent',
            }}
        >
            <div
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: '6px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    padding: '10px 32px 10px 20px',
                    fontFamily: 'monospace, "Geist Mono", "Menlo", "Consolas", "Courier", monospace',
                    fontSize: 32,
                    fontWeight: 600,
                    margin: '10px 15px 0 80px'
                }}
            >
                <button
                    onClick={handleBack}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 32,
                        fontWeight: 300,
                        cursor: 'pointer',
                        marginRight: 16,
                        color: '#1D2D44',
                        padding: 0,
                        transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.6'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    aria-label="Back"
                >
                    &#60;
                </button>
                <span className='text-2xl font-semibold text-black'>{pageName}</span>
            </div>
        </div>
    );
};

export default TopBar;