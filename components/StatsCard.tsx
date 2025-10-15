
import React from 'react';

interface StatsCardProps {
    icon: string;
    title: string;
    value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value }) => {
    return (
        <div
            className="text-center p-4 rounded-xl shadow-lg"
            style={{
                background: `linear-gradient(135deg, var(--header-bg-start), var(--header-bg-end))`,
                color: 'var(--text-color-inverted)'
            }}
        >
            <i className={`${icon} fa-2x mb-2`}></i>
            <div className="text-2xl font-bold my-1">{value}</div>
            <div className="text-sm">{title}</div>
        </div>
    );
};

export default StatsCard;
