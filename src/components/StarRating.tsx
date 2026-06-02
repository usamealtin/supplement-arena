interface StarRatingProps {
  value: number;
  editable?: boolean;
  onChange?: (value: number) => void;
  size?: number;
}

export const StarRating = ({
  value,
  editable = false,
  onChange,
  size = 18,
}: StarRatingProps) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => editable && onChange && onChange(star)}
          style={{
            fontSize: size,
            cursor: editable ? 'pointer' : 'default',
          }}
          className={star <= value ? 'text-brand' : 'text-gray-300'}
        >
          ★
        </span>
      ))}
    </div>
  );
};
