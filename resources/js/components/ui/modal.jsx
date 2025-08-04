import React, { useEffect } from 'react'
import { cn } from '../../lib/utils'

export function Modal({ isOpen, onClose, children, className, ...props }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.body.style.overflow = 'unset'
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          'relative z-50 w-full max-w-md mx-4 bg-white border rounded-lg shadow-lg max-h-[90vh] overflow-y-auto',
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className, ...props }) {
  return (
    <div 
      className={cn('flex items-center justify-between p-6 border-b', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalTitle({ children, className, ...props }) {
  return (
    <h3 
      className={cn('text-lg font-semibold', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function ModalDescription({ children, className, ...props }) {
  return (
    <p 
      className={cn('text-sm text-muted-foreground mt-1', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function ModalContent({ children, className, ...props }) {
  return (
    <div 
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalFooter({ children, className, ...props }) {
  return (
    <div 
      className={cn('flex items-center justify-end space-x-4 p-6 border-t', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ModalClose({ onClose, className, ...props }) {
  return (
    <button
      onClick={onClose}
      className={cn(
        'rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer',
        className
      )}
      {...props}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span className="sr-only">Close</span>
    </button>
  )
}