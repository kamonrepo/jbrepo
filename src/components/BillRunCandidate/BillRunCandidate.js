import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';

import { lighten, makeStyles, Table, 
        TableBody, TableCell, TableContainer, 
        TableHead, TablePagination, TableRow, 
        TableSortLabel, Toolbar, Typography, 
        Paper, Checkbox, IconButton, 
        Tooltip, Select, MenuItem, TextField, Grid, Button
      } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { updateBRC, getBRCById } from '../../actions/billruncandidate';
import { getBillrun } from '../../actions/billrun';

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'package', numeric: false, disablePadding: false, label: 'Package' },
  { id: 'monthlyFee', numeric: false, disablePadding: false, label: 'Monthly Fee' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
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


export default function BillRunCandidate() {

  const dispatch = useDispatch();
  const [handBRC, setHandBRC] = useState([{}]);
  const [selectedBr, setSelectedBr] = useState('');
  const [selectedGroupname, setSelectedGroupname] = useState([]);

  useEffect(() => {
        dispatch(getBillrun());
        console.log('BRC-component mount');
  }, [handBRC])

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusPlaceHolder, setStatusPlaceHolder] = useState([]);

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

  const handleClick = (event, name, id, status) => {

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
    } else {

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
  
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, handBRC.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          handBRC={handBRC} 
          selectedIDs={selectedIDs} 
          setHandBRC={setHandBRC} 
          setSelected={setSelected} 
          setSelectedIDs={setSelectedIDs}
          selectedBr={selectedBr}
          setSelectedBr={setSelectedBr}
          selectedGroupname={selectedGroupname}
          setSelectedGroupname={setSelectedGroupname}
          statusPlaceHolder={statusPlaceHolder}
          setStatusPlaceHolder={setStatusPlaceHolder}
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
                { stableSort(handBRC, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(e) => handleClick(e, row.name, row._id, row.status)}
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

                            <TableCell align="left" id={labelId} scope="row" padding="none">
                              {row.name}
                            </TableCell>

                            <TableCell align="center">{row.package}</TableCell>
                            <TableCell align="center">{row.monthlyFee}</TableCell>
                            <TableCell align="center">{row.status}</TableCell>

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

// TODODODODODO:::START
// TODODODODODO:::START
// TODODODODODO:::START
const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const dispatch = useDispatch();
  const {numSelected, setHandBRC, selectedIDs, setSelectedIDs, selectedBr, setSelectedBr, statusPlaceHolder, setStatusPlaceHolder,
        setSelected, selectedGroupname, setSelectedGroupname } = props;
  const [total, setTotal] = useState(0);  
  const [paid, setPaid] = useState(0);
  const [unpaid, setUnpaid] = useState(0);

  const brc = useSelector(state => state.billruncandidates);
  const billruns = useSelector(state => state.billruns);

  useEffect(() => {
    setHandBRC(brc);
    zCompute(brc);
    console.log('BRC/EToolbar-component mount');
  },[brc]);

  let zCompute = (brc) => {
    let sum = 0;
    let paidSum = 0;
    let unpaindSum = 0;

    //get total
    Object.keys(brc).forEach(key => {
      sum = sum + parseFloat(brc[key].monthlyFee);

      if(brc[key].status === 'PAID') {
          paidSum = paidSum + parseFloat(brc[key].monthlyFee);
      } else {
          unpaindSum = unpaindSum + parseFloat(brc[key].monthlyFee);
      }
    })

    setTotal(sum);
    setPaid(paidSum);
    setUnpaid(unpaindSum);
  }

  const displayGroupName = brid => {

    let grps = [];
    Object.keys(billruns).forEach(brKey => {
    if(billruns[brKey]._id == brid) {
      Object.keys(billruns[brKey].mergedGroup).forEach(arrKey => {
        grps.push(billruns[brKey].mergedGroup[arrKey].name)
      })}
    })

    setSelectedGroupname(grps);
    return grps;
  }

  const handleGroupOnChange = async brid => {

  await dispatch(getBRCById(brid));

    displayGroupName(brid);
    setSelectedBr(brid);
  }
  
  //PAID BUTTON
  const doneClick = async () => {

    let isPaid = isAllPaid(statusPlaceHolder);

    await dispatch(updateBRC({selectedIDs, isPaid}));
    await dispatch(getBRCById(selectedBr));

    setSelected([]);
    setSelectedIDs([]);
    setStatusPlaceHolder([]);
  }

  const backButton = () => {
    setSelected([]);
    setStatusPlaceHolder([]);
  }

  const allEqual = arr => {
    let arrReturn = arr.every(elem => elem === arr[0]);
    return arrReturn;
  }
  const isAllPaid = arr => {
    let arrReturn = arr.every(elem => elem == 'PAID');
    return arrReturn;
  }

  const dynamicButton = () => {
    let toggle = allEqual(statusPlaceHolder);
    let isPaid = isAllPaid(statusPlaceHolder);

    return(
      <Button disabled={!toggle} onClick={doneClick}  variant="contained" color="primary" size="large" type="submit" fullWidth>        
        {toggle? `${isPaid ? 'UNPAID' : 'PAID'}`
               :'SELECT ITEM AS A GROUP'}
      </Button>      
    )
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (      
        <>
          <Grid container spacing={9}>
            <Grid style={ {paddingTop: '50px' }} item lg={6} sm={6} xs={6}>
              <Typography style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px'}} color="inherit" variant="subtitle1" component="div">
                {numSelected} SELECTED
              </Typography>
              <Button onClick={backButton}  variant="contained" color="primary" size="large" type="submit" fullWidth> 
               <b>BACK</b>  
              </Button>
            </Grid>

            <Grid style={{paddingBottom: '99px', paddingTop: '50px' }} item lg={6} sm={6} xs={6}>
              <div style={{ display:'flex', justifyContent: 'center' }}>
                <Tooltip style={{ display:'flex', justifyContent: 'center' }} title="Delete">
                  <IconButton aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
              {dynamicButton()}
            </Grid>

          </Grid>
        </>
       ):(
        <>
          <Grid container spacing={9}>
            <Grid style={ { paddingBottom: '99px', paddingTop: '50px' }} item lg={12} sm={12} xs={12}>
          
                <Typography style={{paddingBottom: '3px', marginLeft:'10px',  fontWeight: 'bolder', fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                GROUP: {selectedGroupname? `${selectedGroupname}` : null}
                </Typography>

                <Typography style={{paddingBottom: '3px', marginLeft:'16px',  fontFamily: 'Segoe UI', color:'#88562e', fontSize: '12px'}} variant="h6" id="tableTitle" component="div">
                 <b>TOTAL: {`??? ${total.toLocaleString()}`}</b> 
                </Typography>

                <Typography style={{paddingBottom: '3px', marginLeft:'25px', color:'green',  fontFamily: 'Segoe UI', fontSize: '12px'}} variant="h6" id="tableTitle" component="div">
                <b>PAID: {`??? ${paid.toLocaleString()}`}</b>
                </Typography>

                <Typography style={{paddingBottom: '3px', marginLeft:'7px', color:'red',  fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                <b>UNPAID: {`??? ${unpaid.toLocaleString()}`}</b>                              
                </Typography>

                <TextField style={{paddingBottom: '9px', marginTop: '36px'}} fullWidth name="search" variant="outlined" label="search..." />

                <Select fullWidth onChange={e => handleGroupOnChange(e.target.value)}>
                  {billruns.map((data) => (
                    <MenuItem key={data._id} value={data._id}>{data.billRun}</MenuItem>
                  ))}
                </Select>             
            </Grid>
          </Grid>
        </>
      )}
    </Toolbar>
  );
};
// TODODODODODO:::END
// TODODODODODO:::END
// TODODODODODO:::END

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};





