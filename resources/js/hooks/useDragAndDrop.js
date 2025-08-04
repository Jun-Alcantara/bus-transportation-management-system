import { useState, useCallback } from 'react'

export const useDragAndDrop = (onFilesSelected) => {
    const [isDragActive, setIsDragActive] = useState(false)

    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true)
        } else if (e.type === 'dragleave') {
            setIsDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragActive(false)

        const files = Array.from(e.dataTransfer.files)
        const excelFiles = files.filter(file => 
            file.type === 'application/vnd.ms-excel' || 
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        if (excelFiles.length > 0) {
            onFilesSelected(excelFiles)
        }
    }, [onFilesSelected])

    return {
        isDragActive,
        handleDrag,
        handleDrop,
    }
}