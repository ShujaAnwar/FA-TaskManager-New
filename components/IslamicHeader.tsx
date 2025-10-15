
import React from 'react';

const IslamicHeader: React.FC = () => {
    return (
        <header 
            className="text-center p-4 rounded-t-xl mb-0"
            style={{ 
                background: `linear-gradient(135deg, var(--header-bg-start), var(--header-bg-end))`,
                color: `var(--text-color-inverted)`
            }}
        >
            <h1 className="text-4xl font-bold font-arabic">بسم الله الرحمن الرحیم</h1>
            <p className="text-lg opacity-90 italic font-arabic mt-2">اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا</p>
        </header>
    );
};

export default IslamicHeader;
