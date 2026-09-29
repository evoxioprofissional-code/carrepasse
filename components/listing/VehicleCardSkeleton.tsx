export function VehicleCardSkeleton() {
  return (
    <div aria-hidden className="flex flex-col overflow-hidden rounded-[10px] border border-line bg-white">
      <div className="aspect-[5/3] animate-pulse bg-[#eceef1]" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="h-5 w-2/3 animate-pulse rounded bg-[#eceef1]" />
        <div className="h-3.5 w-5/6 animate-pulse rounded bg-[#eceef1]" />
        <div className="mt-1 h-7 w-1/2 animate-pulse rounded bg-[#eceef1]" />
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-[#eceef1]" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#eceef1]" />
        <div className="mt-2 h-9 w-full animate-pulse rounded-md bg-[#eceef1]" />
      </div>
    </div>
  );
}
