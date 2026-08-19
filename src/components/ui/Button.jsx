const VARIANTS = {
  primary: "bg-cta-bg text-cta-text hover:bg-cta-bg-hover",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-white",
  onDark: "bg-white text-ink hover:bg-cream",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center rounded-pill px-6 py-3 text-sm font-semibold transition-colors duration-150 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
