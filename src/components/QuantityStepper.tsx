interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const QuantityStepper = ({
  value,
  min = 1,
  max,
  onChange,
}: QuantityStepperProps) => {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (max === undefined || value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center border border-neutral-300 rounded-lg h-11">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-9 h-full flex items-center justify-center text-lg disabled:opacity-30"
      >
        -
      </button>
      <span className="w-8 text-center text-sm">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={max !== undefined && value >= max}
        className="w-9 h-full flex items-center justify-center text-lg disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
};

export default QuantityStepper;
