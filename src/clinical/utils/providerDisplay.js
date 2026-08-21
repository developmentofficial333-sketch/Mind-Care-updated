/** Shared formatting so provider display logic matches wherever a provider card renders. */

export function initialsOf(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function formatFee(feeAmount) {
  const amount = Number(feeAmount);
  if (!amount || Number.isNaN(amount)) return "Fee not listed";
  return `Rs ${amount.toLocaleString("en-US")} / session`;
}
