import React from 'react'
import { Link } from '@inertiajs/react'
import { cn } from '../../lib/utils'
import { Button } from './button'

export function Pagination({ links, className, ...props }) {
  if (!links || links.length <= 3) return null

  return (
    <nav
      className={cn('flex items-center justify-center space-x-1', className)}
      {...props}
    >
      {links.map((link, index) => {
        if (link.url === null) {
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              disabled
              className="cursor-not-allowed opacity-50"
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Button>
          )
        }

        if (link.active) {
          return (
            <Button
              key={index}
              variant="default"
              size="sm"
              style={{ backgroundColor: '#799EFF', color: 'white' }}
              className="cursor-default"
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Button>
          )
        }

        return (
          <Link key={index} href={link.url} preserveState preserveScroll>
            <Button variant="outline" size="sm">
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}

export function PaginationInfo({ from, to, total }) {
  if (!from || !to || !total) return null

  return (
    <div className="text-sm text-muted-foreground">
      Showing {from} to {to} of {total} results
    </div>
  )
}