import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}))

export default function RenderingCaregiverTable({ currentRegionalTrips, threshold, headings }) {
    if (currentRegionalTrips.length) {
        // const headings = ['Destination', 'Time of Day', 'No of Children']
        const rows = currentRegionalTrips.filter(element => element.threshold === threshold)

        // console.log('--------0000', rows, currentRegionalTrips, threshold)
        return (<TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Sector</StyledTableCell>
                        <StyledTableCell align="right">Number of&nbsp;Children</StyledTableCell>
                        <StyledTableCell align="right">Number Travelled With</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <StyledTableCell component="th" scope="row">
                                {row.sector}
                            </StyledTableCell>
                            <StyledTableCell align="right">{row.child_no}</StyledTableCell>
                            <StyledTableCell align="right">{row.caregiver_no}</StyledTableCell>
                            {/* <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell> */}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        )




    }
}