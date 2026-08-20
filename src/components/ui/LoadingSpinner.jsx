export default function LoadingSpinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-[3px] border-clinical-border border-t-clinical-teal"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
