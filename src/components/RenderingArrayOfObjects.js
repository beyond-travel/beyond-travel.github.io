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
        backgroundColor: '#00008B',
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
}));
export default function RenderingArrayOfObjects({ currentRegionalTrips, headings, colnames }) {

    // const headings = ['Destination', 'Time of Day', 'No of Children']
    const rows = currentRegionalTrips
    // console.log(typeof currentRegionalTrips, currentRegionalTrips, '-------------------- %%%%%%%%%%%%%% ========')

    if (rows.length) {
        // const headings = ['Destination', 'Time of Day', 'No of Children']
        // const rows = currentRegionalTrips.filter(element => element.threshold === threshold)

        // console.log('--------0000', rows, currentRegionalTrips, threshold)
        return (<TableContainer component={Paper}>
            <Table sx={{ width: 300 }} aria-label="simple table">
                <TableHead>
                    <StyledTableRow>
                        {headings.map((head) => (
                            <StyledTableCell key={head} >{head}</StyledTableCell>))
                            // <TableCell align="right">Child&nbsp;No.</TableCell>
                            // <TableCell align="right">Adult&nbsp;No.</TableCell>
                        }
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {/* {rows.map((row) => ( */}
                            {colnames.map((colname) =>
                                <StyledTableCell key={colname} component="th" scope="row">
                                    {row[colname]}
                                </StyledTableCell>
                            )}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

        )




    }



    // if (currentRegionalTrips.length) {
    //     const sortedCounts = currentRegionalTrips.sort((a, b) => parseInt(b[sort_col]) - parseInt(a[sort_col]));

    //     const tableRows = sortedCounts.map(
    //         (element) => {
    //             return (

    //                 <tr>
    //                     {Object.values(element).slice(3, 6).map((val) => (
    //                         <td>{val}</td>
    //                     ))}
    //                 </tr>

    //             )
    //         }
    //     )
    //     return (
    //         <div>

    //             <Table hover>
    //                 <thead>
    //                     <tr>
    //                         {headings.map((key) => (
    //                             <th>{key}</th>
    //                         ))}
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {tableRows}
    //                 </tbody>
    //             </Table>

    //         </div>
    //     )
    // }
}