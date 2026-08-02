export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );
}