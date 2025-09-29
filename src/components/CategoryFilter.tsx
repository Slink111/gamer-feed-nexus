import { Badge } from "./ui/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Badge
        variant={selectedCategory === "All" ? "default" : "secondary"}
        className={`cursor-pointer px-4 py-2 hover-glow transition-all ${
          selectedCategory === "All" 
            ? "bg-primary text-primary-foreground shadow-glow" 
            : "hover:bg-primary/20"
        }`}
        onClick={() => onCategorySelect("All")}
      >
        All
      </Badge>
      {categories.map((category) => (
        <Badge
          key={category}
          variant={selectedCategory === category ? "default" : "secondary"}
          className={`cursor-pointer px-4 py-2 hover-glow transition-all ${
            selectedCategory === category 
              ? "bg-primary text-primary-foreground shadow-glow" 
              : "hover:bg-primary/20"
          }`}
          onClick={() => onCategorySelect(category)}
        >
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryFilter;