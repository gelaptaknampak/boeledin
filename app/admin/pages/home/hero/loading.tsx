export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div>
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="mt-3 h-4 w-96 rounded bg-muted" />
      </div>

      {/* Form */}
      <div className="space-y-6 rounded-xl border bg-card p-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-11 w-full rounded bg-muted" />
          </div>
        ))}

        {/* Stats */}
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-muted" />

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div className="h-11 rounded bg-muted" />
              <div className="h-11 rounded bg-muted" />
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="h-11 w-40 rounded bg-muted" />
      </div>
    </div>
  );
}