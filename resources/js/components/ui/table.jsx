import React from 'react'
import { cn } from '../../lib/utils'

export function Table({ className, ...props }) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

export function TableBody({ className, ...props }) {
  return (
    <tbody
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

export function TableFooter({ className, ...props }) {
  return (
    <tfoot
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}

export function TableRow({ className, ...props }) {
  return (
    <tr
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className
      )}
      {...props}
    />
  )
}

export function TableHead({ className, sortable, onSort, sortDirection, ...props }) {
  const isRightAligned = className?.includes('text-right')
  
  return (
    <th
      className={cn(
        'h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
        !isRightAligned && 'text-left',
        isRightAligned && 'text-right',
        sortable && 'cursor-pointer select-none hover:bg-muted/50',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className={cn(
        'flex items-center space-x-2',
        isRightAligned && 'justify-end'
      )}>
        <span>{props.children}</span>
        {sortable && (
          <div className="flex flex-col">
            <svg 
              className={cn('h-3 w-3', sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground')} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <svg 
              className={cn('h-3 w-3 -mt-1', sortDirection === 'desc' ? 'text-foreground' : 'text-muted-foreground')} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>
    </th>
  )
}

export function TableCell({ className, ...props }) {
  return (
    <td
      className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
}