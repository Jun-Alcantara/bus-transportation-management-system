import { useRef, useEffect } from 'react'
import { router } from '@inertiajs/react'

export const useSearch = (searchType, uploadBatchId, filters, otherSearchValue) => {
    const searchInput = useRef(filters[`${searchType}_search`] || '')
    const searchTimeout = useRef(null)
    const searchRef = useRef(null)

    useEffect(() => {
        searchInput.current = filters[`${searchType}_search`] || ''
        if (searchRef.current) {
            searchRef.current.value = searchInput.current
        }
    }, [filters[`${searchType}_search`]])

    const handleSearch = (value) => {
        searchInput.current = value
        
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current)
        }
        
        searchTimeout.current = setTimeout(() => {
            if (searchInput.current !== filters[`${searchType}_search`]) {
                const params = {
                    [`${searchType}_search`]: searchInput.current
                }
                
                if (otherSearchValue !== undefined) {
                    const otherSearchType = searchType === 'files' ? 'students' : 'files'
                    params[`${otherSearchType}_search`] = otherSearchValue
                }
                
                router.get(`/upload-batches/${uploadBatchId}`, params, {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                })
            }
        }, 500)
    }

    return {
        searchInput,
        searchRef,
        handleSearch,
    }
}