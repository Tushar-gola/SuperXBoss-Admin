import * as React from 'react';
import { Paper, Table, TableBody, TableContainer, TablePagination, TableRow, TableHead } from '@mui/material';
import TableCell from '@mui/material/TableCell';
const sty = {
    fontSize: '1.5rem',
    lineHeight: '1.4rem',
    // fontFamily: 'Roboto, sans-serif',
    color: 'Grey',
    textAlign: "center",
    padding: ".1rem 0"
}
const sty1 = {
    fontSize: '1.5rem',
    lineHeight: '1.4rem',
    // fontFamily: 'Roboto, sans-serif',
    color: 'Grey',
    textAlign: "center",
    padding: "1.5rem 0"
}
export default function CustomTable({ rowData, columns, totalPages, handleChangeRowsPerPage, page, setPage, rowsPerPage, orderSty }) {
    return (
        <>
            <Paper sx={{ overflow: 'hidden', px: '2.4rem', mt: '1.5rem', mb: '5.574rem' }}>
                <TableContainer sx={{ maxHeight: '140.7rem' }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    < TableCell
                                        key={column.id}
                                        style={{
                                            fontSize: '1.6rem',
                                            fontWeight: '500',
                                            lineHeight: '1.4rem',
                                            fontFamily: 'Roboto,sans-serif',
                                            color: '#000000',
                                            backgroundColor: '#E3E3E3',
                                            textAlign: "center",
                                        }}
                                    >
                                        {column.label}
                                    </TableCell >
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {rowData?.map((row, index) => {
                                return (
                                    <TableRow key={row.id}>
                                        {columns?.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} sx={{ textAlign: "center", fontSize: "1.4rem" }} style={orderSty == undefined ? sty : sty1} >
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : column.renderCell ? column.renderCell(row) : !!value ? value : "N/A"
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={totalPages}
                    rowsPerPage={rowsPerPage}
                    page={page - 1}
                    onPageChange={(e, page) => setPage(++page)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    style={sty}
                    className='paginations'
                />
            </Paper >


        </>
    );
}