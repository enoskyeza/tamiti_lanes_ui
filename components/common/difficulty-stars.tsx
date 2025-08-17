import { Star } from 'lucide-react';

interface DifficultyStarsProps {
  difficulty: 1 | 2 | 3 | 4 | 5;
  size?: 'sm' | 'md';
  showEmpty?: boolean;
  className?: string;
}

export function DifficultyStars({ 
  difficulty, 
  size = 'md', 
  showEmpty = true,
  className = ''
}: DifficultyStarsProps) {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  
  return (
    <div className={`difficulty-stars ${className}`} title={`Difficulty: ${difficulty}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`
            difficulty-star ${iconSize}
            ${i < difficulty ? 'difficulty-star--filled fill-current' : 'text-gray-300'}
            ${!showEmpty && i >= difficulty ? 'hidden' : ''}
          `}
        />
      ))}
    </div>
  );
}