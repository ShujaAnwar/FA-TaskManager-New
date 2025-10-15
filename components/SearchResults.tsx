
import React from 'react';
// FIX: Import CampusData to allow for proper type casting.
import { AllCampusData, Task, Bill, CampusData } from '../types';

interface SearchResultsProps {
    allData: AllCampusData;
    searchTerm: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ allData, searchTerm }) => {
    const term = searchTerm.toLowerCase();

    const results: { campus: string; type: string; item: Task | Bill }[] = [];

    if (term) {
        Object.entries(allData).forEach(([campusId, campusData]) => {
            if (!campusData) return;
            const campusName = campusId.charAt(0).toUpperCase() + campusId.slice(1);

            // FIX: Cast campusData to CampusData as it is inferred as 'unknown' from Object.entries.
            // This allows accessing its properties 'tasks' and 'bills' without TypeScript errors.
            const typedCampusData = campusData as CampusData;

            // Search tasks
            Object.values(typedCampusData.tasks).flat().forEach(task => {
                if (task.description.toLowerCase().includes(term) || task.id.toLowerCase().includes(term)) {
                    results.push({ campus: campusName, type: 'Task', item: task });
                }
            });

            // Search bills
            typedCampusData.bills.forEach(bill => {
                if (
                    bill.type.toLowerCase().includes(term) ||
                    bill.location.toLowerCase().includes(term) ||
                    bill.account.toLowerCase().includes(term)
                ) {
                    results.push({ campus: campusName, type: 'Bill', item: bill });
                }
            });
        });
    }

    return (
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--cream-light)'}}>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--primary)'}}>
                Search Results for "{searchTerm}"
            </h3>
            {results.length > 0 ? (
                <ul className="space-y-2">
                    {results.map((result, index) => (
                        <li key={index} className="p-3 rounded-md border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--cream-dark)'}}>
                            <div className="flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="font-bold">{result.type}: </span>
                                    {'description' in result.item ? (result.item as Task).description : `${(result.item as Bill).type} - ${(result.item as Bill).account}`}
                                </div>
                                <div className="text-xs text-white font-semibold px-2 py-1 rounded" style={{ backgroundColor: 'var(--primary)'}}>
                                    {result.campus} Campus
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No results found.</p>
            )}
        </div>
    );
};

export default SearchResults;
