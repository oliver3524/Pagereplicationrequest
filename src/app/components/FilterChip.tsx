interface FilterChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, count, selected = false, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
        selected
          ? 'bg-white border-[#EAECEF] text-[#111]'
          : 'bg-white border-[#EAECEF] text-[#667085] hover:text-[#111]'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={selected ? 'text-[#667085]' : 'text-[#667085]'}>
          {count}
        </span>
      )}
    </button>
  );
}
