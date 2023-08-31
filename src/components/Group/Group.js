import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Tab, Tabs, Box, FormLabel, Select, MenuItem  } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, getGroups, createSubLoc, getSublocs, createTargetLoc } from '../../actions/group';
import { createBillrun } from '../../actions/billrun';
import Tree from '../Group/Tree/Tree.js';

import useStyles from './styles';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Group = () => {

    const [groupData, setGroupData] = useState({ name: '' });
    const [sublocData, setSublocData] = useState({ name: '', groupId: '' });
    const [targetlocData, setTargetlocData] = useState({ name: '', sublocId: '' });
    const [sublocTabloc, setSublocTabloc] = useState('');
    const [targetlocTabLoc, setTargetSublocTabLoc] = useState('');
    const [holdTargetLoc, setHoldTargetLoc] = useState('');
    const [sublocDataByGid, setSublocDataByGid] = useState([]);
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const groups = useSelector(state => state.groups);
    const sublocations = useSelector(state => state.sublocations);
    
    useEffect(() => {
        dispatch(getGroups());
        dispatch(getSublocs());
    }, [])

  const handleSubmit = async e => {
    e.preventDefault();

    console.log('group-handleSubmit:, ', groupData);
    dispatch(createGroup(groupData));
  };

  const handleSubmitSubLoc = async e => {

    e.preventDefault();
    console.log('handleSubmitSubLoc-sublocData: ', sublocData);
    dispatch(createSubLoc(sublocData));
  };

  const handleSubmitTargetLoc = async e => {

    e.preventDefault();

    console.log('handleSubmitTargetLoc-targetlocData: ', targetlocData);

     //create tgartget loc first. -> pre req -> targetloc Id on billrun 
    //gawa ng payload req na ang content ay targetloc and billrun
    dispatch(createTargetLoc(targetlocData));
  };

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const debugg = e => {
    e.preventDefault();
    // console.log('targetlocData:: ', targetlocData);
    // console.log('sublocDataByGid:: ', sublocDataByGid);

    console.log('sublocations:: ', typeof(sublocations));
    console.log('sublocations:: ', JSON.stringify(sublocations));
    
    
  };

  if(!user?.result?._id) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In 
        </Typography>
      </Paper>
    );
  }

  const sublocTabSelect1= groupId => {
    console.log('sublocTabSelect1  ', groupId);
     setSublocTabloc(groupId);
     
     setSublocData({ ...sublocData, groupId: groupId});
  };

  const targetlocTabSelect1= async groupId => {
    console.log('FETCH-SUBLOC-USING-THIS-GROUP-ID:  ', groupId);
    let holdSubloc = [];
    setTargetSublocTabLoc(groupId);

    if(groups){
      Object.keys(sublocations).forEach(i => {
        if(sublocations[i].groupId == groupId) {
          holdSubloc.push({ _id:  sublocations[i]._id, name: sublocations[i].name});
        }
      })
      console.log('holdSubloc-for-select::::  ', holdSubloc);
      setSublocDataByGid(holdSubloc);

    }

  };

  const targetlocTabSelect2 = sublocId => {
    console.log('targetloc-Tab-Select-SubLocation-sublocId: ', sublocId);
    setHoldTargetLoc(sublocId);
    let holdSublocName = '';

    Object.keys(sublocations).forEach(i => {
      if(sublocations[i].sublocId == sublocId) {
        holdSublocName = sublocations[i].name;
      }
    })

   // setTargetSublocTabSubLoc(holdSublocName);

    setTargetlocData({ ...targetlocData, sublocId: sublocId});
  };

  const watermark = {
    italicText: {
      fontStyle: 'italic',
      fontSize: '11px',
      fontWeight: 'bold'
    }
  };

  return (     
    <div>

      <Paper elevation={9} style={{ backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Box sx={{ width: '150%' }}>
            <Box style={{ display: 'flex', justifyContent: 'center'} } sx={{  width: '100%', borderBottom: 11, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab style={{ fontWeight: 'bolder' }} label="CITY" {...a11yProps(0)} />
                <Tab style={{ fontWeight: 'bolder' }} label="MUNICIPALITY" {...a11yProps(1)} />
                <Tab style={{ fontWeight: 'bolder' }} label="LOCATION" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Paper className={classes.addGroupForm} elevation={6}>
                <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                    <TextField required 
                      name="name"
                      variant="outlined" 
                      label={<span style={watermark.italicText}>Eg. Cavite, Batanggas, Laguna ...</span>}
                      fullWidth value={groupData.name} 
                      onChange={(e) => setGroupData({...groupData, name: e.target.value})}
                    />
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                </form>
              </Paper>
            </TabPanel>

            {/* subloc */}
            <TabPanel value={value} index={1}>
            <Paper className={classes.addGroupForm} elevation={6}>
                <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitSubLoc}>
                  
                  <FormLabel style={{ fontWeight: 'bold'}}>City</FormLabel>
                  <Select className={classes.Select} fullWidth value={sublocTabloc} onChange={e => sublocTabSelect1(e.target.value)}>
                    {groups.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>

                  <TextField required name="tfsubloc" variant="outlined" label={<span style={watermark.italicText}>Add Municipality</span>} fullWidth value={sublocData.name} onChange={(e) => setSublocData({...sublocData, name: e.target.value})} />
                  <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>

                </form>
              </Paper>
            </TabPanel>

            {/* targetloc */}
            <TabPanel value={value} index={2}>
            <Paper className={classes.addGroupForm} elevation={6}>
                <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitTargetLoc}>
                  
                  <FormLabel style={{ fontWeight: 'bold' }}>City</FormLabel>
                  <Select className={classes.Select} fullWidth value={targetlocTabLoc} onChange={e => targetlocTabSelect1(e.target.value)}>
                    {groups.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>

                  <FormLabel style={{ fontWeight: 'bold', paddingTop: '20px'}}>Municipality</FormLabel>
                  <Select className={classes.Select} fullWidth value={holdTargetLoc} onChange={e => targetlocTabSelect2(e.target.value)}>
                    
                    {/* dapat dito na ung filtered sublocations */}
                    {sublocDataByGid.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>

                  <TextField required name="tftargetloc" variant="outlined" label={<span style={watermark.italicText}>Add Location</span>} fullWidth value={targetlocData.name} onChange={(e) => setTargetlocData({...targetlocData, name: e.target.value})} />
                  <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                  {/* <Button variant="contained" color="secondary" size="small" fullWidth onClick={debugg}> Clear </Button> */}

                </form>
              </Paper>
            </TabPanel>
          </Box>
      </Paper>

      <Paper elevation={9} style={{ marginTop: '33px', backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Tree />
      </Paper>

    </div>
  )
}

export default Group;