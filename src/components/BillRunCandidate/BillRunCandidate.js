import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten, makeStyles, Table, 
        TableBody, TableCell, TableContainer, 
        TableHead, TablePagination, TableRow, 
        TableSortLabel, Toolbar, Typography, 
        Paper, Checkbox, IconButton, 
        Tooltip, Select, MenuItem, TextField, Button,
        FormControl, InputLabel
      } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { updateBRC, getBRCById } from '../../actions/billruncandidate';
import { updatePayment, getPayments } from '../../actions/payment';
import { getBillrun } from '../../actions/billrun';
import { getGroups } from '../../actions/group';
import { getSublocs } from '../../actions/sublocation';
import { getTargetLocs } from '../../actions/targetlocation';

const headCells = [
  { id: 'name', numeric: false, disablePadding: true, label: 'NAME' },
  { id: 'plan', numeric: false, disablePadding: false, label: 'PLAN' },
  { id: 'monthlyFee', numeric: false, disablePadding: false, label: 'MONTHLY FEE' },
  { id: 'dueDate', numeric: false, disablePadding: false, label: `DUE DATE (${getMonthNameFromDate(new Date())})` },
  { id: 'status', numeric: true, disablePadding: false, label: 'STATUS' },
];

function getMonthNameFromDate(date) {
  const monthOptions = { month: 'long' };
  return date.toLocaleString('en-US', monthOptions);
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
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        }
}));

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%'
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
        dispatch(getPayments());
        dispatch(getGroups());
        dispatch(getSublocs());
        dispatch(getTargetLocs());
  }, [handBRC]);

  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [selectedIDs, setSelectedIDs] = useState([]);
  const [selectedMFs, setSelectedMFs] = useState([]);
  const [selectedBRCClient, setSelectedBRCClient] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusPlaceHolder, setStatusPlaceHolder] = useState([]);
  const [query, setQuery] = useState('');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if(event.target.checked) {
      const newSelecteds = handBRC.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name, id, status, monthlyFee, clientId) => {
    
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
      setSelectedBRCClient(prev => [...prev, clientId]);
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
        selectedBRCClient.splice(index, 1);
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
          numSelected={selected.length} 
          handBRC={handBRC} 
          selectedIDs={selectedIDs} 
          selectedBRCClient={selectedBRCClient}
          selectedMFs={selectedMFs} 
          setHandBRC={setHandBRC} 
          setSelected={setSelected} 
          setSelectedIDs={setSelectedIDs}
          setSelectedBRCClient={setSelectedBRCClient}
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
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(e) => handleClick(e, row.name, row._id, row.status, row.monthlyFee, row.client)}
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
                              {row.name}
                            </TableCell>

                            <TableCell align="left">{row.planName}</TableCell>
                            <TableCell align="left">{row.monthlyFee}</TableCell>
                            <TableCell align="left">{row.dueDate}</TableCell>
                            <TableCell align="left">{row.status}</TableCell>

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
  const dispatch = useDispatch();
  const {numSelected, setHandBRC, selectedIDs, setSelectedIDs, selectedMFs, selectedBRCClient, setSelectedBRCClient, setSelectedMFs, selectedBr, setSelectedBr, statusPlaceHolder, setStatusPlaceHolder,
        setSelected, selectedGroupname, setSelectedGroupname, query, setQuery } = props;
  const [total, setTotal] = useState(0);  
  const [paid, setPaid] = useState(0);
  const [unpaid, setUnpaid] = useState(0);

  const brc = useSelector(state => state.billruncandidates);
  const billruns = useSelector(state => state.billruns);
  const groups = useSelector(state => state.groups);
  const sublocations = useSelector(state => state.sublocations);
  const targetlocations = useSelector(state => state.targetlocations);
  const payments = useSelector(state => state.payments);

  const [ggroup, setGgroup] = useState('');
  const [ssubloc, setSsubloc] = useState('');
  const [bbr, setBbr] = useState('');
  const [sublocData, setSublocData] = useState({ name: '', groupId: '' });
  const [sublocDataByGroupId, setSublocDataByGroupId] = useState([]);
  const [targetlocDataBySublocId, setTargetlocDataBySublocId] = useState([]);
  const [brDataBySublocId, setBRDataBySublocId] = useState([]);

  function getCurrentMonthPeriod(date) {

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    let formattedDate = `${year}-${month}`;

    return formattedDate;
}

  let filterBRCbyMonthPeriod = brc => {

    let payload = [];

    let returnMonthPeriod = getCurrentMonthPeriod(new Date());
    Object.keys(brc).forEach(index => {

        if(brc[index].monthPeriod == returnMonthPeriod) {
          payload.push(brc[index])
        }
    })
    return payload;
  }
  
  useEffect(() => {
    setHandBRC(filterBRCbyMonthPeriod(brc));
    // zCompute(brc, billruns);
    console.log('useEffect setHandBRC: ', filterBRCbyMonthPeriod(brc));
  },[brc]);

  let zCompute = brid => {

    let total = 0;
    let paidSum = 0;
    let unpaindSum = 0;


    Object.keys(billruns).forEach(brKey => {
      if(billruns[brKey]._id == brid) {
        total =  billruns[brKey].total;
        paidSum = billruns[brKey].paid;
        unpaindSum = billruns[brKey].unpaid;
      }
    })

    setTotal(total);
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
  console.log('handleGroupOnChange::: ', brid);

  setQuery('');
  dispatch(getBRCById(brid));
  displayGroupName(brid);
  setSelectedBr(brid);
  zCompute(brid);

  }
  
  //PAID BUTTON
  const doneClick = async () => {

    await new Promise(resolve => {

    let isPaid = isAllPaid(statusPlaceHolder);

    dispatch(updatePayment({selectedIDs, isPaid, selectedMFs, selectedBr, selectedBRCClient}));
    //dispatch(updateBRC({selectedIDs, isPaid, selectedMFs, selectedBr}));
    dispatch(getBRCById(selectedBr));

    resolve(true);
    })

    setSelected([]);
    setSelectedIDs([]);
    setSelectedMFs([]);
    setSelectedBRCClient([]);
    setStatusPlaceHolder([]);

    console.log('umabot ba dito?')
  }

  const backButton = () => {
    setSelected([]);
    setSelectedIDs([]);
    setSelectedMFs([]);
    setSelectedBRCClient([]);
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

  const searchOnChange =  value => {
    setQuery(value);
    // return new Promise(async (resolve, reject) => {
    //   try{
    //     resolve(setQuery(value));
    //   } catch(e) {
    //     reject(e);
    //   }

    // })
  }

  const LocationOnChange = groupId => {

    setGgroup(groupId);
    setSublocData({ ...sublocData, groupId: groupId});
    let holdSubloc = [];

    if(groups){
      Object.keys(sublocations).forEach(i => {
        if(sublocations[i].groupId == groupId) {
          holdSubloc.push({ _id:  sublocations[i]._id, name: sublocations[i].name});
        }
      });

      setSublocDataByGroupId(holdSubloc);
    }
  };

  const SubLocationOnChange = sublocId => {
    console.log('SubLocationOnChange::: ', sublocId);
    setSsubloc(sublocId);

    let holdTl = [];

    if(targetlocations){
      Object.keys(targetlocations).forEach(i => {
        if(targetlocations[i].sublocId == sublocId) {

          holdTl.push({_id: targetlocations[i]._id, name: targetlocations[i].name});
        }
      })
    }

    //console.log('holdTlID::: ', holdTl);
    let holdBR = []

    let targetlocIds = holdTl.map(item => item._id);
    let targetlocIdsBR = billruns.map(item => item.targetlocId);

    let filteredTLids = targetlocIds.filter(id => targetlocIdsBR.includes(id));

    console.log('filteredTLids::: ', filteredTLids);

    if(billruns){
      Object.keys(billruns).forEach(i => {

            for(let x=0; x<filteredTLids.length; x++){
              if(billruns[i].targetlocId == filteredTLids[x]) {
              holdBR.push(billruns[i]);
            }
          }
      })
    }

    setBRDataBySublocId(holdBR);
  };

  const BrOnChange = brid => {
    setBbr(brid);
    console.log('BrOnChangeeeeeeeeeee::: ', brid); 

    setQuery('');
    dispatch(getBRCById(brid));
    displayGroupName(brid);
    setSelectedBr(brid);
    zCompute(brid);

    // setClientData({ ...clientData, targetlocId: brid, targetloc: tlName });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center'}}>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (      
          <div>
            <Paper elevation={9} style={{ width: '100%', margin: '3px 3px 3px 3px', backgroundColor: '#6db4e3', display: 'flex', flexDirection: 'row'}}>
              <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>       
                <Typography style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px'}} color="inherit" variant="subtitle1" component="div">
                  {numSelected} SELECTED
                </Typography>
                <Button onClick={backButton} variant="contained" color="primary" size="large" type="submit" fullWidth> 
                <b>BACK</b>  
                </Button>
              </div>

              <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>       
                  <Tooltip style={{ display:'flex', justifyContent: 'center' }} title="Delete">
                    <IconButton aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  {dynamicButton()}
              </div>
            </Paper>
          </div>
        ):(
          <div>
            <Paper elevation={9} style={{ width: '100%', margin: '9px 9px 9px 9px', backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row'}}>
              <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', textAlign: 'center'}}>    
                  <FormControl>
                  <InputLabel id="demo-select-small-label">CITY</InputLabel>
                    <Select style={{width: '200px'}} labelId="demo-select-small-label" id="demo-select-small" value={ggroup} onChange={e => LocationOnChange(e.target.value)}>
                      {groups.map((data) => (
                        <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                      ))}
                    </Select>       
                  </FormControl>

                  <FormControl> 
                    <InputLabel id="demo-select-small-label">MUNICIPALITY</InputLabel>
                    <Select style={{width: '200px'}} labelId="demo-select-small-label" id="demo-select-small" value={ssubloc} onChange={e => SubLocationOnChange(e.target.value)}>
                      {sublocDataByGroupId.map((data) => (
                        <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                      ))}
                  </Select>
                  </FormControl>

                  <FormControl>
                      <InputLabel id="demo-select-small-label">LOCATION</InputLabel>
                      <Select style={{width: '200px'}} labelId="demo-select-small-label" id="demo-select-small" value={bbr} onChange={e => BrOnChange(e.target.value)}>
                      
                      {brDataBySublocId.map((data) => (
                          <MenuItem key={data._id} value={data._id}>{data.billRun}</MenuItem>
                        ))}
                      </Select>
                  </FormControl>

                  <TextField style={{paddingBottom: '9px', marginTop: '36px'}} fullWidth name="search" variant="outlined" label="search..." value={query.length !== 0 ? query : ''} onChange={e => searchOnChange(e.target.value)} />
              </div>

              <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>                   
                  <Typography style={{paddingBottom: '3px', marginLeft:'10px',  fontWeight: 'bolder', fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                    <b>LOCATION: {selectedGroupname? `${selectedGroupname}` : null} </b>
                  </Typography>
                    
                  <Typography style={{paddingBottom: '3px', marginLeft:'16px',  fontFamily: 'Segoe UI', color:'#88562e', fontSize: '12px'}} variant="h6" id="tableTitle" component="div">
                    <b>TOTAL: {`₱ ${total.toLocaleString()}`}</b> 
                  </Typography>

                  <Typography style={{paddingBottom: '3px', marginLeft:'25px', color:'green',  fontFamily: 'Segoe UI', fontSize: '12px'}} variant="h6" id="tableTitle" component="div">
                    <b>PAID: {`₱ ${paid.toLocaleString()}`}</b>
                  </Typography>

                  <Typography style={{paddingBottom: '3px', marginLeft:'7px', color:'red',  fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                    <b>UNPAID: {`₱ ${unpaid.toLocaleString()}`}</b>                              
                  </Typography>
              </div>
            </Paper>
          </div>
        )}
      </Toolbar>
    </div>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};





