import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles = {
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  error: 'bg-red-100 text-red-800 hover:bg-red-200',
  info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

export function StatusBadge({ status, children, className, ...props }) {
  const variantClass = statusStyles[status] || statusStyles.default;

  return (
    <Badge
      variant="outline"
      className={cn(variantClass, 'border-transparent font-medium', className)}
      {...props}
    >
      {children}
    </Badge>
  );
}
