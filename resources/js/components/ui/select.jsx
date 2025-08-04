import { forwardRef, useState, createContext, useContext, useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

const SelectContext = createContext()

export function Select({ children, value, onValueChange, defaultValue, ...props }) {
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef(null)
  
  const currentValue = value !== undefined ? value : internalValue
  
  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

  return (
    <SelectContext.Provider value={{
      value: currentValue,
      onValueChange: handleValueChange,
      isOpen,
      setIsOpen
    }}>
      <div ref={selectRef} className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = forwardRef(({ className, children, ...props }, ref) => {
  const { value, isOpen, setIsOpen } = useContext(SelectContext)
  
  return (
    <button
      ref={ref}
      type="button"
      role="combobox"
      aria-expanded={isOpen}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...props}
    >
      {children}
      <svg
        className={cn(
          "h-4 w-4 opacity-50 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

export const SelectValue = forwardRef(({ className, placeholder, children, ...props }, ref) => {
  const { value } = useContext(SelectContext)
  
  return (
    <span
      ref={ref}
      className={cn("block truncate", className)}
      {...props}
    >
      {children || value || placeholder}
    </span>
  )
})
SelectValue.displayName = "SelectValue"

export const SelectContent = forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen } = useContext(SelectContext)
  
  if (!isOpen) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full z-50 mt-1 w-full rounded-md border shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      style={{ backgroundColor: 'white' }}
      {...props}
    >
      <div className="max-h-60 overflow-auto p-1" style={{ backgroundColor: 'white' }}>
        {children}
      </div>
    </div>
  )
})
SelectContent.displayName = "SelectContent"

export const SelectItem = forwardRef(({ className, children, value, ...props }, ref) => {
  const { onValueChange, value: selectedValue } = useContext(SelectContext)
  const isSelected = selectedValue === value
  
  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors duration-150 hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-blue-100 text-blue-900 hover:bg-blue-200",
        className
      )}
      onClick={() => onValueChange(value)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {children}
    </div>
  )
})
SelectItem.displayName = "SelectItem"