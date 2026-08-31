export default function Toggle({ on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${
        on ? "bg-clinical-teal" : "bg-clinical-border"
      }`}
    >
      <span
        className={`absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white transition-all ${
          on ? "left-[20px]" : "left-0.5"
        }`}
      />
    </button>
  );
}
