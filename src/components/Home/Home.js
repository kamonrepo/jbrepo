import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles, Table, 
        TableBody, TableCell, TableContainer, 
        TableHead, TablePagination, TableRow, 
        TableSortLabel, Toolbar, Typography, 
        Paper, Checkbox, TextField, Grid
      } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getBillrun } from '../../actions/billrun';
import { computeFees } from '../../actions/billruncandidate';

const headCells = [
    { id: 'group', numeric: false, disablePadding: true, label: 'Group' },
    { id: 'paid', numeric: false, disablePadding: false, label: 'Paid' },
    { id: 'unpaid', numeric: false, disablePadding: false, label: 'Unpaid' },
    { id: 'total', numeric: true, disablePadding: false, label: 'Total' }
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
                inputProps={{ 'aria-label': 'select all desserts' }}
              />
            </TableCell>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    {headCell.label}
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

const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
}));

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
  const [handBRC, setHandBRC] = useState([{}]);
  const [selectedBr, setSelectedBr] = useState('');
  const [selectedGroupname, setSelectedGroupname] = useState([]);

  const [total, setTotal] = useState(0);  
  const [paid, setPaid] = useState(0);
  const [unpaid, setUnpaid] = useState(0);
  
  const brc = useSelector(state => state.billruns);

  useEffect(() => {
    let isCanceled = false;
    
    if(!isCanceled) {
        dispatch(getBillrun());
        dispatch(computeFees());
        setHandBRC(brc);
    }

    return () => {
      isCanceled = true;
    }

  }, [handBRC]);

  let zCompute = holdBrc => {

    let total = 0;
    let paidSum = 0;
    let unpaindSum = 0;

    Object.keys(holdBrc).forEach(index => {
        total =  parseFloat(total) + parseFloat(holdBrc[index].total);
        paidSum = parseFloat(paidSum) + parseFloat(holdBrc[index].paid);
        unpaindSum = parseFloat(unpaindSum) + parseFloat(holdBrc[index].unpaid);
    });

    setTotal(total);
    setPaid(paidSum);
    setUnpaid(unpaindSum);
  }

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [selectedMFs, setSelectedMFs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [statusPlaceHolder, setStatusPlaceHolder] = useState([]);
  const [query, setQuery] = useState('');

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
      setSelectedMFs(prev => [...prev, monthlyFee]);
      setStatusPlaceHolder(prev => [...prev, status]);
      console.log('checked: ');

    } else {
      console.log('unchecked: ');
      //uncheck
      let index = selectedIDs.indexOf(id);
      let statusIndex = statusPlaceHolder.indexOf(status);
      
      if(index > -1) {
        selectedIDs.splice(index, 1);
        selectedMFs.splice(index, 1);
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

  const handleDataTable = () => {

    if(query.length != 0) {
      let lowerCaseQuery = query.toLowerCase();
      const filtered = handBRC.filter(brc => brc.name.toLowerCase() == lowerCaseQuery);

      if(filtered.length > 0) {
        return filtered;
      }
      return handBRC;
    } else {
      return handBRC;
    }

  }
  
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, handBRC.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar 
          total={total}
          setTotal={setTotal}
          paid={paid}
          setPaid={setPaid}
          unpaid={unpaid}
          setUnpaid={setUnpaid}
          numSelected={selected.length} 
          handBRC={handBRC} 
          selectedIDs={selectedIDs} 
          selectedMFs={selectedMFs} 
          setHandBRC={setHandBRC} 
          setSelected={setSelected} 
          setSelectedIDs={setSelectedIDs}
          setSelectedMFs={setSelectedMFs}
          selectedBr={selectedBr}
          setSelectedBr={setSelectedBr}
          selectedGroupname={selectedGroupname}
          setSelectedGroupname={setSelectedGroupname}
          statusPlaceHolder={statusPlaceHolder}
          setStatusPlaceHolder={setStatusPlaceHolder}
          query={query}
          setQuery={setQuery}
         />

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
                { stableSort(handleDataTable(), getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.billRun);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(e) => handleClick(e, row.billRun, row.paid, row.unpaid, row.total)}
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

                            <TableCell align="left">{row.paid}</TableCell>
                            <TableCell align="left">{row.unpaid}</TableCell>
                            <TableCell align="left">{row.total}</TableCell>

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
  const classes = useToolbarStyles();
  const {numSelected, query, setQuery, total, paid, unpaid, handBRC } = props;
  
  const searchOnChange =  value => {
    setQuery(value);
  }

  return (
    <Toolbar
    className={clsx(classes.root, {
      [classes.highlight]: numSelected > 0,
    })}
    >
          <Grid container spacing={9}>
            <Grid style={ { paddingBottom: '99px', paddingTop: '50px' }} item lg={12} sm={12} xs={12}>
          
                <Typography style={{paddingBottom: '3px', marginLeft:'10px',  fontWeight: 'bolder', fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                 NO. OF GROUP: {handBRC? `${handBRC.length}` : 0}
                </Typography>

                <Typography style={{paddingBottom: '3px', marginLeft:'16px',  fontFamily: 'Segoe UI', color:'#88562e', fontSize: '12px'}} variant="h6" id="tableTitle" component="div">
                 <b>TOTAL: {`₱ todo`}</b> 
                </Typography>

                <Typography style={{paddingBottom: '3px', marginLeft:'25px', color:'green',  fontFamily: 'Segoe UI', fontSize: '12px'}} variant="h6" id="tableTitle" component="div">
                <b>PAID: {`₱ todo`}</b>
                </Typography>

                <Typography style={{paddingBottom: '3px', marginLeft:'7px', color:'red',  fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                <b>UNPAID: {`₱ todo`}</b>                              
                </Typography>
                
                <TextField style={{paddingBottom: '9px', marginTop: '36px'}} fullWidth name="search" variant="outlined" label="search..." value={query.length !== 0 ? query : ''} onChange={e => searchOnChange(e.target.value)} />

            </Grid>
          </Grid>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


