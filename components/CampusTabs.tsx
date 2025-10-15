
import React from 'react';
import { CampusId } from '../types';

interface CampusTabsProps {
    campuses: CampusId[];
    activeCampus: CampusId;
    onSelectCampus: (campusId: CampusId) => void;
}

const ICONS: Record<CampusId, string> = {
    [CampusId.Main]: 'fas fa-building',
    [CampusId.Johar]: 'fas fa-school',
    [CampusId.Masjid]: 'fas fa-mosque',
    [CampusId.Maktab]: 'fas fa-book',
    [CampusId.ControlPanel]: 'fas fa-cogs',
};

const CampusTabs: React.FC<CampusTabsProps> = ({ campuses, activeCampus, onSelectCampus }) => {
    return (
        <nav className="flex flex-wrap gap-2 mb-4">
            {campuses.map(campus => {
                const campusName = campus === CampusId.ControlPanel
                    ? 'Control Panel'
                    : `${campus.charAt(0).toUpperCase() + campus.slice(1)} Campus`;
                
                return (
                    <button
                        key={campus}
                        onClick={() => onSelectCampus(campus)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2 border-2 ${
                            activeCampus === campus
                                ? 'text-white'
                                : ''
                        }`}
                        style={{
                           backgroundColor: activeCampus === campus ? 'var(--primary)' : 'var(--card-bg)',
                           borderColor: 'var(--primary)',
                           color: activeCampus === campus ? 'var(--text-color-inverted)' : 'var(--primary)',
                        }}
                    >
                        <i className={ICONS[campus]}></i>
                        {campusName}
                    </button>
                )
            })}
        </nav>
    );
};

export default CampusTabs;
