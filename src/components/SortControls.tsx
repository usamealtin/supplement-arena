import React from 'react';

interface SortControlsProps {
  sortField: string;
  sortDir: 'asc' | 'desc';
  onSortFieldChange: (field: string) => void;
  onSortDirChange: () => void;
}

export const SortControls: React.FC<SortControlsProps> = ({
  sortField,
  sortDir,
  onSortFieldChange,
  onSortDirChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between mb-4 bg-white p-3 border border-gray-200 shadow-sm gap-4 rounded">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase text-gray-500">Sırala:</span>
        <select
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value)}
          className="border border-gray-300 text-sm font-bold p-2 outline-none cursor-pointer rounded"
        >
          <option value="cost_per_gram">1 Gram Maliyeti</option>
          <option value="cost_per_serving">1 Servis Maliyeti</option>
          <option value="price">Kutu Fiyatı</option>
          <option value="taste">Kullanıcı Puanı</option>
        </select>
      </div>
      <button
        onClick={onSortDirChange}
        className="text-xs font-bold uppercase border border-gray-300 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded transition-colors"
      >
        {sortDir === 'asc' ? '↑ Artan' : '↓ Azalan'}
      </button>
    </div>
  );
};
