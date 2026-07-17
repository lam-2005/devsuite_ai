const ErrorReasonSkeleton = () => {
  return (
    <>
      <div className="h-6 w-48 bg-muted rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
        <div className="h-4 w-4/6 bg-muted rounded"></div>
      </div>
    </>
  );
};
const AISuggestionSkeleton = () => {
  return (
    <>
      <div className="h-6 w-48 bg-muted rounded mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-muted rounded"></div>
        <div className="h-4 w-5/6 bg-muted rounded"></div>
        <div className="h-4 w-4/6 bg-muted rounded"></div>
      </div>
    </>
  );
};
export { ErrorReasonSkeleton, AISuggestionSkeleton };
