import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Tab, Tabs, Box, FormLabel, Select, MenuItem  } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, getGroups, createSubLoc, getSublocs, createTargetLoc, getTargetlocs } from '../../actions/group';
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
    const [isFormSubmitted, setIsFormSubmitted] = useState({ flag: false, opt: null});
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const groups = useSelector(state => state.groups);
    const sublocations = useSelector(state => state.sublocations);
    
  useEffect(() => {

    dispatch(getGroups());
    dispatch(getSublocs());
    dispatch(getTargetlocs());
  }, [])

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
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
     setSublocTabloc(groupId);
     
     setSublocData({ ...sublocData, groupId: groupId});
  };

  const targetlocTabSelect1= async groupId => {
    let holdSubloc = [];
    setTargetSublocTabLoc(groupId);

    if(groups){
      Object.keys(sublocations).forEach(i => {
        if(sublocations[i].groupId == groupId) {
          holdSubloc.push({ _id:  sublocations[i]._id, name: sublocations[i].name});
        }
      })
      setSublocDataByGid(holdSubloc);

    }

  };

  const targetlocTabSelect2 = sublocId => {

    setHoldTargetLoc(sublocId);
    let holdSublocName = '';

    Object.keys(sublocations).forEach(i => {
      if(sublocations[i].sublocId == sublocId) {
        holdSublocName = sublocations[i].name;
      }
    })

    setTargetlocData({ ...targetlocData, sublocId: sublocId});
  };

  const watermark = {
    italicText: {
      fontStyle: 'italic',
      fontSize: '11px',
      fontWeight: 'bold'
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    dispatch(createGroup(groupData));
    setIsFormSubmitted({...isFormSubmitted, flag: true, opt: 'getGroups'});
    setGroupData({ name: '' });
  };

  const handleSubmitSubLoc = async e => {
    e.preventDefault();

    dispatch(createSubLoc(sublocData));
    setIsFormSubmitted({...isFormSubmitted, flag: true, opt: 'getSublocs'});
    setSublocData({ name: '', groupId: '' });
    setSublocTabloc('');

  };

  const handleSubmitTargetLoc = async e => {
    e.preventDefault();

    dispatch(createTargetLoc(targetlocData));
    setIsFormSubmitted({...isFormSubmitted, flag: true, opt: 'getTargetlocs'});
    setTargetlocData({ name: '', sublocId: '' });
    setTargetSublocTabLoc('');
    setHoldTargetLoc('');
  };

  return (     
    <div>
      <Paper elevation={9} style={{ backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Box style={{ display: 'flex', flexDirection: 'column' } } sx={{ width: '150%' }}>
            <Box style={{ display: 'flex', justifyContent: 'center'} } sx={{  width: '100%', borderBottom: 11, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
                <Tab style={{ fontWeight: 'bolder' }} label="CITY" {...a11yProps(0)} />
                <Tab style={{ fontWeight: 'bolder' }} label="MUNICIPALITY" {...a11yProps(1)} />
                <Tab style={{ fontWeight: 'bolder' }} label="LOCATION" {...a11yProps(2)} />
              </Tabs>
            </Box>

            {/* CITY */}
            <TabPanel style={{ display: 'flex', justifyContent: 'center'}} value={value} index={0}>
              <Paper className={classes.addGroupForm} elevation={6}>
                <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                    <TextField required 
                      name="name"
                      variant="outlined" 
                      label={<span style={watermark.italicText}>Eg. Cavite </span>}
                      fullWidth value={groupData.name} 
                      onChange={(e) => setGroupData({...groupData, name: e.target.value})}
                    />
                    <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>ADD CITY</Button>
                </form>
              </Paper>
            </TabPanel>

            {/* MINUCIPALITY */}
            <TabPanel style={{ display: 'flex', justifyContent: 'center'}} value={value} index={1}>
            <Paper className={classes.addGroupForm} elevation={6}>
                <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitSubLoc}>
                  
                  <FormLabel style={{ fontWeight: 'bold'}}>City</FormLabel>
                  <Select required className={classes.Select} fullWidth value={sublocTabloc} onChange={e => sublocTabSelect1(e.target.value)}>
                    {groups.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>

                  <TextField required name="tfsubloc" variant="outlined" label={<span style={watermark.italicText}>Add Municipality</span>} fullWidth value={sublocData.name} onChange={(e) => setSublocData({...sublocData, name: e.target.value})} />
                  <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>

                </form>
              </Paper>
            </TabPanel>

            {/* LOCATION */}
            <TabPanel style={{ display: 'flex', justifyContent: 'center'}}  value={value} index={2}>
            <Paper className={classes.addGroupForm} elevation={6}>
                <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitTargetLoc}>
                  
                  <FormLabel style={{ fontWeight: 'bold' }}>City</FormLabel>
                  <Select required className={classes.Select} fullWidth value={targetlocTabLoc} onChange={e => targetlocTabSelect1(e.target.value)}>
                    {groups.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>

                  <FormLabel style={{ fontWeight: 'bold', paddingTop: '20px'}}>Municipality</FormLabel>
                  <Select required className={classes.Select} fullWidth value={holdTargetLoc} onChange={e => targetlocTabSelect2(e.target.value)}>
                    
                    {/* dapat dito na ung filtered sublocations */}
                    {sublocDataByGid.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>

                  <TextField required name="tftargetloc" variant="outlined" label={<span style={watermark.italicText}>Add Location</span>} fullWidth value={targetlocData.name} onChange={(e) => setTargetlocData({...targetlocData, name: e.target.value})} />
                  <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>

                </form>
              </Paper>
            </TabPanel>
          </Box>
      </Paper>

      <Tree isFormSubmitted={isFormSubmitted}/>
    </div>
  )
}

export default Group;