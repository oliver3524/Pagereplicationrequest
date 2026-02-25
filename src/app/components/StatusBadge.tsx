interface StatusBadgeProps {
  type: 'needs-reply' | 'overdue' | 'resolved' | 'lead' | 'member' | 'unknown' | 'tier-2';
  label?: string;
}

export function StatusBadge({ type, label }: StatusBadgeProps) {
  const getStyles = () => {
    switch (type) {
      case 'needs-reply':
        return 'border-orange-300 text-orange-700 bg-orange-50';
      case 'overdue':
        return 'border-red-300 text-red-700 bg-red-50';
      case 'resolved':
        return 'border-gray-300 text-gray-600 bg-gray-50';
      case 'lead':
        return 'border-blue-300 text-blue-700 bg-blue-50';
      case 'member':
        return 'border-green-300 text-green-700 bg-green-50';
      case 'unknown':
        return 'border-gray-300 text-gray-600 bg-gray-50';
      case 'tier-2':
        return 'border-purple-300 text-purple-700 bg-purple-50';
      default:
        return 'border-gray-300 text-gray-600 bg-gray-50';
    }
  };

  const getDefaultLabel = () => {
    switch (type) {
      case 'needs-reply':
        return 'Needs Reply';
      case 'overdue':
        return 'Overdue';
      case 'resolved':
        return 'Resolved';
      case 'lead':
        return 'Lead';
      case 'member':
        return 'Member';
      case 'unknown':
        return 'Unknown';
      case 'tier-2':
        return 'Tier 2';
      default:
        return '';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${getStyles()}`}>
      {label || getDefaultLabel()}
    </span>
  );
}