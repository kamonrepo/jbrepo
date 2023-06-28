import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Grid, Container, Tab, Tabs, Box  } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, getGroups } from '../../actions/group';
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
          <Typography>{children}</Typography>
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

    const [groupData, setGroupData] = useState({ name: '', subloc: ''});
    const [value, setValue] = useState(0);

    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const groups = useSelector(state => state.groups);
    
    useEffect(() => {
        dispatch(getGroups());
    }, [groups])

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('group-handleSubmit');
    //dispatch(createGroup(groupData));
  };

  const handleSubmitSubLoc = async e => {
    e.preventDefault();
    console.log('group-handleSubmit-subloc');
   // dispatch(createGroup(groupData));
  };

  const handleChange = (event, newValue) => {
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

  return (     
    <Container component="main" maxWidth="xs">
    <Grid style={{ display: 'flex'}} container spacing={9}>
      <Grid style={ {paddingTop: '50px' }} item lg={12} sm={12} xs={12}>

            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Location" {...a11yProps(0)} />
                  <Tab label="Sub location" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Paper className={classes.addGroupForm} elevation={6}>
                  <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                      <TextField required name="name" variant="outlined" label="Add location" fullWidth value={groupData.name} onChange={(e) => setGroupData({...groupData, name: e.target.value})} />
                      <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                  </form>
                </Paper>
              </TabPanel>
              <TabPanel value={value} index={1}>
              <Paper className={classes.addGroupForm} elevation={6}>
                  <form autoComplete="off" className={`${classes.root} ${classes.form}`} onSubmit={handleSubmitSubLoc}>
                      <TextField required name="name" variant="outlined" label="Add sub location" fullWidth value={groupData.subloc} onChange={(e) => setGroupData({...groupData, subloc: e.target.value})} />
                      <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                  </form>
                </Paper>
              </TabPanel>
            </Box>

        </Grid>

      <Grid style={ {paddingBottom: '99px',marginTop: '3px' }} item lg={12} sm={12} xs={12}>
        <Paper className={classes.groupListPaper} elevation={6}>
          <Tree />
        </Paper>
      </Grid>

    </Grid>
    </Container>
  )
}

export default Group;