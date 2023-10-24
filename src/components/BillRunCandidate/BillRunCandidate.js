import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Toolbar, Typography, Paper, Checkbox, IconButton, Tooltip, Select, MenuItem, TextField, Button, FormControl, InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getBRCByBRId, getBRCByMonthPeriod } from '../../actions/billruncandidate';
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
          <TableCell>
            {/* <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            /> */}
            {null}
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
                  <span style={{ fontWeight: 'bold' }}>{headCell.label}</span>

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
    flexDirection: 'column',
    width: '100%'
  },
  marvsMarginRight: {
    marginRight: '33px'
  },
  marvsMarginBottom: {
    marginBottom: '11px'
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  paperMiddle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
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

  let marvsCurrentDate = new Date();
  const marvsCurrentYear = marvsCurrentDate.getFullYear();
  const marvsCurrentMonth = marvsCurrentDate.getMonth() + 1; //0 index ung January

  const marvs12MOS = [
    { id: '01', code: 'JAN'},
    { id: '02', code: 'FEB'},
    { id: '03', code: 'MAR'},
    { id: '04', code: 'APR'},
    { id: '05', code: 'MAY'},
    { id: '06', code: 'JUN'},
    { id: '07', code: 'JUL'},
    { id: '08', code: 'AUG'},
    { id: '09', code: 'SEP'},
    { id: '10', code: 'OCT'},
    { id: '11', code: 'NOV'},
    { id: '12', code: 'DEC'},
  ];
  console.log('marvsCurrentMonth.toString()-CHECK TO LATER BKA PAG SINGLE DIGIT LIKE JANUARY ay 1 or 01::: ', marvsCurrentMonth.toString());
  let findCurrentMOS = marvs12MOS.find((mos) => mos.id === marvsCurrentMonth.toString());

  const dispatch = useDispatch();
  const [handBRC, setHandBRC] = useState([{}]);
  const [selectedBr, setSelectedBr] = useState('');
  const [selectedGroupname, setSelectedGroupname] = useState([]);

  useEffect(() => {

    let isCanceled = false;
    
    if(!isCanceled) {
        dispatch(getBillrun());
        dispatch(getPayments());
        dispatch(getGroups());
        dispatch(getSublocs());
        dispatch(getTargetLocs());
        //console.log('[COMPONENT-PARENT]BillRunCandidate top useEffect');
      }

    return () => {
      //console.log('[COMPONENT-PARENT]BillRunCandidate UNMOUNT !!!!');
      isCanceled = true;
    }

  }, []);

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
  const [query, setQuery] = useState(''); // this is for search

  const [monthPeriodData, setMonthPeriodData] = useState('');
  const [selectedMonthPeriodYEAR, setSelectedMonthPeriodYEAR] = useState(marvsCurrentYear);
  const [selectedMonthPeriodMOS, setSelectedMonthPeriodMOS] = useState(findCurrentMOS.code);

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
    console.log('handleClick init: ');
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

    // the -1 value means it is CHECKED/SELECTED
    if(selectedIndex === -1) {
      setSelectedIDs(prev => [...prev, id]);
      setSelectedMFs(prev => [...prev, monthlyFee]);
      setSelectedBRCClient(prev => [...prev, clientId]);
      setStatusPlaceHolder(prev => [...prev, status]);
      console.log('checked: ');

    } 

    //UNCHECKED
    else {
      console.log('unchecked: ');

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

  const handleDataTable = handBRC => {
   
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

  const searchOnChange =  value => {
    setQuery(value);
  }

  function formatToPhilippinePeso(number) {
    if(number){
    return number.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
    }
  }

  const debugg = () => {
  }

  function getPreviousThreeYears() {
    let currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const previousYears = [];
  
    for (let i = 0; i < 3; i++) {
      const year = currentYear - i;
      previousYears.push(year);
    }

    console.log('getPreviousThreeYears-returnnnn::: ', previousYears);
  
    return previousYears;
  }

  const monthPeriodYEAROnChange = data => {
    setSelectedMonthPeriodYEAR(data)
  }

  const monthPeriodMOSOnChange = data => {
    setSelectedMonthPeriodMOS(data)
  }

  const generateBRC = () => {


  }

  const filterBRCbyMPBRID = () => {

    let findMOSID = marvs12MOS.find((mos) => mos.code === selectedMonthPeriodMOS);
    let monthPeriod = `${findMOSID.id}/01/${selectedMonthPeriodYEAR}`;


    if(monthPeriod.length !== 0 && selectedBr.length !== 0) {

    setMonthPeriodData(monthPeriod);
    let payload = { monthPeriod, host: selectedBr };

    console.log('payload::: ', payload);
    dispatch(getBRCByMonthPeriod(payload));

    }


  }

  return (
    <div className={classes.root}>

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
     
      <Paper className={classes.paperMiddle}>


          <div style={{ display: 'flex', margin: '33px 33px 33px 33px'}}>
            <FormControl className={classes.marvsMarginRight}>
                <InputLabel style={{ paddingTop: '9px' }}><b>MONTH</b></InputLabel>
                <Select style={{ fontWeight: 'bold', width: '66px'}}  onChange={e => monthPeriodMOSOnChange(e.target.value)} id="damos" value={selectedMonthPeriodMOS}>
                  {marvs12MOS.map((data, index) => (
                    <MenuItem id={index} key={index} value={data.code}>{data.code}</MenuItem>
                  ))}
                </Select>       
            </FormControl>

            <FormControl  className={classes.marvsMarginRight}>
                <InputLabel style={{ paddingTop: '9px' }} ><b>YEAR</b></InputLabel>
                <Select style={{ fontWeight: 'bold', width: '66px'}}  onChange={e => monthPeriodYEAROnChange(e.target.value)} id="dayear" value={selectedMonthPeriodYEAR}>
                  {getPreviousThreeYears().map((data, index) => (
                    <MenuItem key={index} value={data}>{data}</MenuItem>
                  ))}
                </Select>       
            </FormControl>

            <Button onClick={filterBRCbyMPBRID} className={classes.marvsMargin} variant="contained">FILTER</Button>
          </div>

          <div style={{ display: 'flex', margin: '33px 33px 33px 33px'}}>
            <TextField className={classes.marvsMarginRight} name="search" variant="outlined" label="search name" value={query.length !== 0 ? query : ''} onChange={e => searchOnChange(e.target.value)}/>        
              
            {/* <button onClick={debugg}>debugg</button> */}
          </div>

      </Paper>

      <Button className={classes.marvsMarginBottom} onClick={generateBRC} variant="contained">GENERATE</Button>
      
      <Paper className={classes.paper}>
        <TableContainer>
            <Table className={classes.table} aria-labelledby="tableTitle" size={'medium'} aria-label="enhanced table">
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
                  { stableSort(handleDataTable(handBRC), getComparator(order, orderBy))
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
                      selected={isItemSelected}>
  
                        <TableCell padding="checkbox"><Checkbox checked={isItemSelected}/></TableCell>
                        <TableCell align="left" id={labelId} scope="row" padding="none">{row.name}</TableCell>
                        <TableCell align="left">{row.planName}</TableCell>
                        <TableCell align="left">{''}</TableCell>
                        {/* <TableCell align="left">{row.monthlyFee && Object.keys(row.monthlyFee).length > 1 ? Object.keys(row.monthlyFee).length : row && row.monthlyFee && row.monthlyFee[0].amount}</TableCell> */}
                        {/* <TableCell align="left">{formatToPhilippinePeso(parseFloat(row.monthlyFee))}</TableCell> */}
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
  const { numSelected,  setHandBRC, selectedIDs, setSelectedIDs, selectedMFs, selectedBRCClient, setSelectedBRCClient, setSelectedMFs, selectedBr, setSelectedBr, statusPlaceHolder, setStatusPlaceHolder,
        setSelected, setSelectedGroupname, setQuery } = props;


  const billruns = useSelector(state => state.billruns);
  const groups = useSelector(state => state.groups);
  const sublocations = useSelector(state => state.sublocations);
  const targetlocations = useSelector(state => state.targetlocations);
  const brc = useSelector(state => state.billruncandidates);
  const [ggroup, setGgroup] = useState('');
  const [ssubloc, setSsubloc] = useState('');
  const [bbr, setBbr] = useState('');
  const [sublocData, setSublocData] = useState({ name: '', groupId: '' });
  const [sublocDataByGroupId, setSublocDataByGroupId] = useState([]);
  const [brDataBySublocId, setBRDataBySublocId] = useState([]);

  const user = JSON.parse(localStorage.getItem('profile'));

  function updateMonthlyFees(payload, overDueClient) {
    const updatedPayload = payload.map((item) => {
      const clientID = item.client;
      const monthPeriod = item.monthPeriod;
      
      const matchingClients = overDueClient.filter((client) => client.client === clientID);
  
      if (matchingClients.length > 0) {
        const previousMonthsFees = matchingClients
          .filter((client) => client.status === "NOTPAID" && client.monthPeriod < monthPeriod)
          .flatMap((client) => client.monthlyFee);
  
        if (previousMonthsFees.length > 0) {
          item.monthlyFee = [...item.monthlyFee, ...previousMonthsFees];
        }
      }
  
      return item;
    });
  
    return updatedPayload;
  }

  function getFirstDayOfMonth(date) {
    // Create a new Date object with the same year and month
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    
    const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour12: false, // Use 24-hour format
    timeZone: 'Asia/Manila',
   };
  
   const formattedDate = firstDayOfMonth.toLocaleString('en-US', options);

   return formattedDate;
  } 

  function overdueFilter(data) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is 0-indexed in JavaScript

    const filteredData = data.filter(item => {
        const clientCount = data.filter(clientItem => clientItem.client === item.client).length;
        const itemMonth = parseInt(item.monthPeriod.split('/')[0]);

        return clientCount >= 2 && item.status === "NOTPAID" && itemMonth < currentMonth;
    });

    return filteredData;
  }

  const filterBRCbyMonthPeriod =  brc => {

    console.log('brc-raw: ', brc);

    let overDueClient = overdueFilter(brc);
    console.log('overDueClient:: ',  overDueClient);
    
    let payload = [];

    let withOverdue = null;

    let returnMonthPeriod = getFirstDayOfMonth(new Date());

    Object.keys(brc).forEach(index => {
        if(brc[index].monthPeriod == returnMonthPeriod) {
          payload.push(brc[index])
        }
    })

    withOverdue = payload;

    //les-go-here:::
    //let temp = updateMonthlyFees(withOverdue, overDueClient);

   // console.log('payload-return-temp::: ', JSON.stringify(temp));
   // console.log('payload-return-temp::: ', JSON.stringify(temp));
    return payload;
  }

  useEffect(() => {

    let isCanceled = false;
    
    if(!isCanceled) {

      let holdBRC = brc ? brc : null;
      setHandBRC(filterBRCbyMonthPeriod(holdBRC)); 

      console.log('[COMPONENT-CHILD]EnhancedTableToolbar bottom useEffect: ');
    }

    return () => {
      console.log('[COMPONENT-CHILD]EnhancedTableToolbar UNMOUNT !!!!');
      isCanceled = true;
    }

  }, [brc]);

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

  const BrOnChange = async brid => {
      console.log("BrOnChange");
      setBbr(brid);
      setQuery('');
      await dispatch(getBRCByBRId(brid));
      displayGroupName(brid);
      setSelectedBr(brid);
  };

  //PAID BUTTON SUBMIT
  const doneClick = async () => {

     let isPaid = isAllPaid(statusPlaceHolder);

     let userFullname = user.result.firstname + ' ' + user.result.lastname;

     console.log('---------updatePayment::: ', {userFullname, selectedIDs, isPaid, selectedMFs, selectedBr, selectedBRCClient})
    
    // await dispatch(updatePayment({userFullname, selectedIDs, isPaid, selectedMFs, selectedBr, selectedBRCClient}));
    // await dispatch(getBRCByBRId(selectedBr));
    // // await setHandBRC(filterBRCbyMonthPeriod(brc));

    // setSelected([]);
    // setSelectedIDs([]);
    // setSelectedMFs([]);
    // setSelectedBRCClient([]);
    // setStatusPlaceHolder([]);
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

  const dynamicButton =  () => {
    let toggle = allEqual(statusPlaceHolder);
    let isPaid = isAllPaid(statusPlaceHolder);

    return(
      <Button disabled={!toggle} onClick={doneClick}  variant="contained" color="primary" size="large" type="submit" fullWidth>        
        {toggle? `${isPaid ? 'UNPAID' : 'PAID'}`
               :'SELECT ITEM AS A GROUP'}
      </Button>      
    )
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

    setSsubloc(sublocId);

    let holdTl = [];

    if(targetlocations){
      Object.keys(targetlocations).forEach(i => {
        if(targetlocations[i].sublocId == sublocId) {

          holdTl.push({_id: targetlocations[i]._id, name: targetlocations[i].name});
        }
      })
    }

    let holdBR = []

    let targetlocIds = holdTl.map(item => item._id);
    let targetlocIdsBR = billruns.map(item => item.targetlocId);

    let filteredTLids = targetlocIds.filter(id => targetlocIdsBR.includes(id));

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

  return (
    <div>
      <Toolbar className={clsx(classes.root, {[classes.highlight]: numSelected > 0,})}></Toolbar>

      <div>
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
                <Paper elevation={9} style={{ width: '100%', marginBottom: '9px', backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row' }}>
                  <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>    
                      <FormControl>
                      <InputLabel id="label-city"><b>CITY</b></InputLabel>
                        <Select style={{ fontWeight: 'bold', width: '200px'} }  id="cbxGroup" value={ggroup} onChange={e => LocationOnChange(e.target.value)}>
                          {groups.map((data) => (
                            <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                          ))}
                        </Select>       
                      </FormControl>

                      <FormControl> 
                        <InputLabel id="label-municipality"><b>MUNICIPALITY</b></InputLabel>
                        <Select style={{ fontWeight: 'bold', width: '200px' }} id="cbxMunic" value={ssubloc} onChange={e => SubLocationOnChange(e.target.value)}>
                          {sublocDataByGroupId.map((data) => (
                            <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                          ))}
                      </Select>
                      </FormControl>

                      <FormControl>
                          <InputLabel id="label-location"><b>LOCATION</b></InputLabel>
                          <Select style={{ fontWeight: 'bold', width: '200px' }} id="cbxLoc" value={bbr} onChange={e => BrOnChange(e.target.value)}>
                          
                          {brDataBySublocId.map((data) => (
                              <MenuItem key={data._id} value={data._id}>{data.billRun}</MenuItem>
                          ))}
                          </Select>
                      </FormControl>             
                  </div>
                  {/* 
                  <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>                   
                      <Typography style={{paddingBottom: '3px', marginLeft:'10px',  fontWeight: 'bolder', fontFamily: 'Segoe UI', fontSize: '12px' }} variant="h6" id="tableTitle" component="div">
                        <b>LOCATION: {selectedGroupname? `${selectedGroupname}` : null} </b>
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
                  </div> */}
                </Paper>
              </div>
        )}
      </div>
    </div>
  );

};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};





