import React from 'react'
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalClose } from './modal'
import { Button } from './button'

export function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  description = "Are you sure you want to perform this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false
}) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-sm">
      <ModalHeader>
        <div>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </div>
        <ModalClose onClose={onClose} />
      </ModalHeader>
      
      <ModalContent>
        <div className="flex justify-end space-x-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm}
            disabled={isLoading}
            style={variant === 'destructive' ? { backgroundColor: '#DC3C22', color: 'white' } : {}}
            className={variant === 'destructive' ? 'hover:opacity-90' : ''}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}