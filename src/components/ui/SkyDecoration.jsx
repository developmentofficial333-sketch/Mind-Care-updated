export default function SkyDecoration() {
  return (
    <svg
      viewBox="0 0 1280 220"
      className="block w-full text-brand-orange"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <circle cx="640" cy="230" r="170" fill="currentColor" />
      <g fill="white" opacity="0.9">
        <ellipse cx="220" cy="70" rx="90" ry="34" />
        <ellipse cx="300" cy="55" rx="60" ry="26" />
        <ellipse cx="1040" cy="90" rx="100" ry="36" />
        <ellipse cx="960" cy="70" rx="65" ry="28" />
      </g>
    </svg>
  );
}
