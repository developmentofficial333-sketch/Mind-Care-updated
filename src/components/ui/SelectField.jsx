export default function SelectField({ id, label, children, ...selectProps }) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <select
        id={id}
        className="rounded-md border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-ink"
        {...selectProps}
      >
        {children}
      </select>
    </div>
  );
}
