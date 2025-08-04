import { Check, X, Clock, AlertCircle } from 'lucide-react'

export const getStatusIcon = (status) => {
    switch (status) {
        case 'completed':
            return <Check className="h-4 w-4 text-green-500" />
        case 'failed':
            return <X className="h-4 w-4 text-red-500" />
        case 'processing':
            return <Clock className="h-4 w-4 text-blue-500" />
        default:
            return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
}

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}