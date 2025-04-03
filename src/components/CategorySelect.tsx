import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Category } from '../types/question';

interface CategorySelectProps {
  categories: Category[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const CategorySelect = ({
  categories,
  value,
  onValueChange,
  disabled = false,
  className = ''
}: CategorySelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px] overflow-y-auto">
        <SelectItem value="all">Todas as categorias</SelectItem>
        {categories.map(category => (
          <SelectItem key={category.id} value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}; 