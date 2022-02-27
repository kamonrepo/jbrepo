import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Paper, Select, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../actions/group';
import { createClient } from '../../actions/client';
import useStyles from './styles';

const Client = () => {

    const groups = useSelector(state => state.groups)
    const [clientData, setClientData] = useState({  group:'', name: '', contactNumber: '', package: '', dueDate: '', monthlyFee: '', address: '' });
    const [group, setGroup] = useState('');
    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
      dispatch(getGroups());

    }, [])

  const handleOnchange = data => {
    setGroup(data);
    let group = groups.filter(g => g.name == data);

    console.log('setClientData:: ', JSON.stringify({ ...clientData, group: group[0]._id}));

    setClientData({ ...clientData, group: group[0]._id})
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    dispatch(createClient(clientData));
  };

  if (!user?.result?._id) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In 
        </Typography>
      </Paper>
    );
  }

    return (     
      <>        
        <Paper className={classes.paper} elevation={6}>
          <form className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
              <Typography className={classes.Header} variant="h6"> Add Client </Typography>
              <Select className={classes.Select} fullWidth value={group} onChange={e => handleOnchange(e.target.value)}>
                  {groups.map((data) => (
                    <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                  ))}
              </Select>
              <TextField name="name" variant="outlined" label="Registered name" fullWidth value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} />
              <TextField name="contactNumber" variant="outlined" label="Contact Number" fullWidth multiline rows={4} value={clientData.contactNumber} onChange={(e) => setClientData({...clientData, contactNumber: e.target.value})}  />
              <TextField name="package" variant="outlined" label="Package" fullWidth value={clientData.package} onChange={(e) => setClientData({ ...clientData, package: e.target.value})} />
              <TextField name="dueDate" variant="outlined" label="Due Date" fullWidth value={clientData.dueDate} onChange={(e) => setClientData({ ...clientData, dueDate: e.target.value})}/>
              <TextField name="monthlyFee" variant="outlined" label="Monthly Fee" fullWidth value={clientData.monthlyFee} onChange={(e) => setClientData({ ...clientData, monthlyFee: e.target.value})}/>
              <TextField name="address" variant="outlined" label="Address" fullWidth value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} />
            
              <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth> Submit </Button>
              <Button variant="contained" color="secondary" size="small" fullWidth> Clear </Button>
        </form>
      </Paper>
      </>
    )
}

export default Client;