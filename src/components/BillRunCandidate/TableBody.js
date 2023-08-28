import React, { useState } from 'react';
import { TableBody, TableCell, TableRow, Checkbox} from '@material-ui/core';

  export default function TableBody() {

    const [selected, setSelected] = useState([]);

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
          const order = comparator(a[0], b[0]);
          if (order !== 0) return order;
          return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
          return -1;
        }
        if (b[orderBy] > a[orderBy]) {
          return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
          ? (a, b) => descendingComparator(a, b, orderBy)
          : (a, b) => -descendingComparator(a, b, orderBy);
      }
    
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, handBRC.length - page * rowsPerPage);
      

    return(
        <TableBody>
        
        {stableSort(handBRC, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => {
            const isItemSelected = isSelected(row.name);
            const labelId = `enhanced-table-checkbox-${index}`;
    
            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.name)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row.name}
                selected={isItemSelected}
              >
                    <TableCell padding="checkbox">
                    <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                    />
                    </TableCell>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                    {row.name}
                    </TableCell>
                    <TableCell align="center">{row.package}</TableCell>
                    <TableCell align="center">{row.monthlyFee}</TableCell>
                    <TableCell align="center">{row.paymentInfo}</TableCell>
    
              </TableRow>
            );
        })}

        {emptyRows > 0 && (
          <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
            <TableCell colSpan={6} />
          </TableRow>
        )}
      </TableBody>
    
    )
  }
