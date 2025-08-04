import React, { useState, createContext, useContext } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { cn } from '../../lib/utils'

const SidebarContext = createContext({})

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export function SidebarProvider({ children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  
  return (
    <SidebarContext.Provider value={{ open, setOpen, toggle: () => setOpen(!open) }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children, className, ...props }) {
  const { open } = useSidebar()
  
  return (
    <div
      className={cn(
        'relative flex h-full w-64 flex-col border-r transition-all duration-300',
        !open && 'w-16',
        className
      )}
      style={{ backgroundColor: 'hsl(var(--sidebar-bg))' }}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarHeader({ children, className, ...props }) {
  const { open } = useSidebar()
  
  return (
    <div
      className={cn(
        'flex items-center border-b px-4 py-4',
        !open && 'px-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarContent({ children, className, ...props }) {
  return (
    <div
      className={cn('flex-1 overflow-hidden py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SidebarNav({ children, className, ...props }) {
  return (
    <nav
      className={cn('space-y-1 px-2', className)}
      {...props}
    >
      {children}
    </nav>
  )
}

export function SidebarNavItem({ href, icon: Icon, children, active, className, ...props }) {
  const { open } = useSidebar()
  const { url } = usePage()
  const isActive = active ?? (href && url.startsWith(href))
  
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        !open && 'justify-center px-2',
        className
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {open && <span className="truncate">{children}</span>}
    </Link>
  )
}

export function SidebarToggle({ className, ...props }) {
  const { toggle, open } = useSidebar()
  
  return (
    <button
      onClick={toggle}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary',
        className
      )}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {open ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        )}
      </svg>
    </button>
  )
}

export function SidebarFooter({ children, className, ...props }) {
  return (
    <div
      className={cn('border-t p-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}