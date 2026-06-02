
import { CATEGORY_INFO } from '../utils/helpers';

interface CategoryInfoProps {
  category: string;
}

export const CategoryInfo = ({ category }: CategoryInfoProps) => {
  if (!category || !CATEGORY_INFO[category]) {
    return null;
  }

  return (
    <div className="bg-white border-l-4 border-brand p-5 mb-6 shadow-sm rounded">
      <h2 className="text-xl font-bold text-gray-900 mb-2 uppercase">{category} NEDİR?</h2>
      <p className="text-sm text-gray-600 leading-relaxed">{CATEGORY_INFO[category]}</p>
    </div>
  );
};
