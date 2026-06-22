interface Props {
  value: number;
  originalPrice?: number | null;
  className?: string;
}

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Renders a price with the ₹ symbol slightly smaller than the number.
 * If `originalPrice` is set and higher than `value`, it's shown struck
 * through right before the current price.
 */
export default function Price({ value, originalPrice, className = "" }: Props) {
  const showOriginal = originalPrice != null && originalPrice > value;

  return (
    <span className={className}>
      {showOriginal && (
        <span className="line-through text-muted/70 font-normal text-[0.85em] mr-1.5">
          <span className="text-[0.8em]">₹</span>
          {formatINR(originalPrice)}
        </span>
      )}
      <span className="text-[0.8em]">₹</span>
      {formatINR(value)}
    </span>
  );
}
