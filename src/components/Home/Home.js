import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Button, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography, Paper, Checkbox
       } from '@material-ui/core';     
import { useDispatch, useSelector } from 'react-redux';
import { computeFees } from '../../actions/billruncandidate';
import { getDataLocation } from '../../actions/report';

const headCells = [
    { id: 'location', numeric: false, disablePadding: true, label: 'LOCATION' },
    { id: 'paid', numeric: false, disablePadding: false, label: 'PAID' },
    { id: 'unpaid', numeric: false, disablePadding: false, label: 'UNPAID' },
    { id: 'total', numeric: true, disablePadding: false, label: 'CLIENT' }
];
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
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <>
      <TableHead>
          <TableRow>

            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            </TableCell>

              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.label === 'CLIENT'? 'center' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                  style={{fontSize: '16px', fontWeight: 'bold'}}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    { headCell.label} 

                    {orderBy === headCell.id ? (
                      <span className={classes.visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </span>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
              ))}

          </TableRow>
      </TableHead>
      </>
    );
}
EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};
const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
}));

export default function Home() {

  const dispatch = useDispatch();
  const [handBRC, setHandBRC] = useState([]);
  const { data, isLoading } = useSelector((state) => state.brccomputedfees);

  useEffect(() => {
    let isCanceled = false;
    
    if(!isCanceled) {
        dispatch(computeFees());
    }

    console.log('[PARENT] useEffect done dispatch');
    return () => {
      isCanceled = true;
    }

  }, []);

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('location');
  const [selected, setSelected] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusPlaceHolder, setStatusPlaceHolder] = useState([]);
  const [pdfData, setPdfData] = useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = handBRC.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, id, status, monthlyFee) => {
    //handleClick(e, row.billRun, row.paid, row.unpaid, row.total)
    const selectedIndex = selected.indexOf(name);
    
    let newSelected = [];
    let newSelectedStatus = [];
  
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
      newSelectedStatus = newSelectedStatus.concat(statusPlaceHolder, status);

    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
      newSelectedStatus = newSelectedStatus.concat(statusPlaceHolder.slice(1));

    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
      newSelectedStatus = newSelectedStatus.concat(statusPlaceHolder.slice(0, -1));

    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );

      newSelectedStatus = newSelectedStatus.concat(
        statusPlaceHolder.slice(0, selectedIndex),
        statusPlaceHolder.slice(selectedIndex + 1),
      );

    }

    // the -1 value means it is checked/selected
    if(selectedIndex === -1) {
      setSelectedIDs(prev => [...prev, id]);

      setStatusPlaceHolder(prev => [...prev, status]);
      console.log('checked: ');

    } else {
      console.log('unchecked: ');
      //uncheck
      let index = selectedIDs.indexOf(id);
      let statusIndex = statusPlaceHolder.indexOf(status);
      
      if(index > -1) {
        selectedIDs.splice(index, 1);
      }
      if(statusIndex > -1){
        statusPlaceHolder.splice(statusIndex, 1);
      }
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function formatToPhilippinePeso(number) {
    return number.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
  }


  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, handBRC.length - page * rowsPerPage);

  return (
    isLoading ? <CircularProgress /> 
    :
    <div className={classes.root}>

      <EnhancedTableToolbar 
        computedFees={data}
        numSelected={selected.length} 
        handBRC={handBRC} 
        selectedIDs={selectedIDs} 
        setHandBRC={setHandBRC} 
        setSelected={setSelected} 
        setSelectedIDs={setSelectedIDs}
        statusPlaceHolder={statusPlaceHolder}
        setStatusPlaceHolder={setStatusPlaceHolder}
        dispatch={dispatch}
        setPdfData={setPdfData}
        pdfData={pdfData}
      />

      <Paper elevation={9} className={classes.paper}>
        <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={'medium'}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={handBRC.length}
              />
              <TableBody>
                { stableSort(handBRC, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.billRun);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    
                    return (
                      <TableRow
                        hover
                        onClick={(e) => handleClick(e, row.billRun, row.totalPaidSum, row.totalNotPaidSum, row.total)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>

                            <TableCell align="left" id={labelId} scope="row" padding="none">
                              {row.billRun}
                            </TableCell>

                            <TableCell align="left" style={{ color: 'green' }}>{formatToPhilippinePeso(row.totalPaidSum)}</TableCell>
                            <TableCell align="left" style={{ color: 'red' }}>{formatToPhilippinePeso(row.totalNotPaidSum)}</TableCell>
                            <TableCell align="center">
                              <span style={{ fontWeight: 'bold', color: 'green' }}>{row.totalPaidClients}</span>
                              {' / '}
                              <span style={{ fontWeight: 'bold', color: 'red' }}>{row.totalUnpaidClients}</span>
                            </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (66) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>             
            </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={handBRC.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}


const EnhancedTableToolbar = props => {
  const { handBRC, setHandBRC , computedFees, dispatch } = props;

  const { data, isLoading } = useSelector((state) => state.reports);

  useEffect(() => {
    let isCanceled = false;
    
    if(!isCanceled) {
      setHandBRC(computedFees);

      console.log('[CHILD] useEffect done setHandBRC(computedFees)');
    }

    return () => {
      isCanceled = true;
    }

  }, []);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  async function base64ToPDF(base64Data) {
    // Decode the base64 data
    const binaryData = atob(base64Data);
  
    // Create a Uint8Array from the binary data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
  
    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
  
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'output.pdf';
    link.click();
  }

  const handlePrint =  async () => {

    //add isloading here
    await dispatch(getDataLocation());
    await base64ToPDF(data);

  };

  return (
    <div>
    <Paper style={{ marginBottom: '33px', backgroundColor: '#dce8e0', display: 'flex', justifyContent: 'space-between' }}>

      <Typography style={{ margin: '3px 3px 3px 3px'}} variant="h6" id="nogroup">
        TOTAL LOCATIONS: {handBRC? `${handBRC.length}` : 0}
      </Typography>    
      <Button onClick={handlePrint} style={{ margin: '3px 3px 3px 3px' }} variant='contained'><b>EXPORT PDF</b></Button>

    </Paper>
    </div>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


