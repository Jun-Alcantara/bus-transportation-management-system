import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../../components/ui/table'
import { Pagination, PaginationInfo } from '../../../components/ui/pagination'
import { School } from 'lucide-react'

const Step4Schools = ({ schoolValidations, filters, onSearch }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <School className="h-5 w-5" />
                        <span>Trip Assignment Schools</span>
                    </CardTitle>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search school codes or names..."
                            defaultValue={filters.school_validation_search || ''}
                            onChange={(e) => onSearch(e.target.value)}
                            className="w-64"
                        />
                        <svg
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {schoolValidations && schoolValidations.data?.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>School Code</TableHead>
                                    <TableHead>School Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Record Count</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schoolValidations.data.map((validation) => (
                                    <TableRow key={validation.school_code}>
                                        <TableCell className="font-medium">
                                            {validation.school_code}
                                        </TableCell>
                                        <TableCell>
                                            {validation.sch_name || <span className="text-muted-foreground">—</span>}
                                        </TableCell>
                                        <TableCell>
                                            {validation.is_unknown_school ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Unknown
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    Known
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {validation.record_count.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        
                        <div className="flex items-center justify-between p-4 border-t">
                            <PaginationInfo
                                from={schoolValidations.from}
                                to={schoolValidations.to}
                                total={schoolValidations.total}
                            />
                            <Pagination links={schoolValidations.links} />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <School className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-muted-foreground">
                            {filters.school_validation_search ? 'No trip assignment schools found matching your search.' : 'No trip assignment school data available for this batch.'}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default Step4Schools