interface Props {
  value: number;
  className?: string;
}

/** Renders a price with the ₹ symbol slightly smaller than the number. */
export default function Price({ value, className = "" }: Props) {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);

  return (
    <span className={className}>
      <span className="text-[0.8em]">₹</span>
      {formatted}
    </span>
  );
}
