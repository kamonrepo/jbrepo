import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Select, MenuItem } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { createLocation } from '../../actions/location';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';

const islandOptions = [
    {
        id: 0,
        name: ''
    }, 
    {
        id: 1,
        name: 'LUZON'
    }, 
    {
        id: 2,
        name: 'VISAYAS'
    }, 
    {
        id: 3,
        name: 'MINDANAO'
    }, 
]

const Location = () => {

    const [locationData, setLocationData] = useState({ island: '', province: '', mainLocation: '', subLocation: ''});

    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useHistory();
    const [island, setIsland] = useState('');

    const IslandHandleChange = e => {
        setIsland(prev => prev = e.target.value);
        setLocationData({ ...locationData, island: e.target.value });

        console.log('selected island: ', island);
      };

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(createLocation(locationData));

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
      <Paper className={classes.paper} elevation={6}>
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
            <Typography className={classes.Header} variant="h6"> Add Location </Typography>
                <Select className={classes.Select} fullWidth value={island} onChange={e => IslandHandleChange(e)}>
                    {islandOptions.map((data) => (
                      <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                    ))}
                </Select>
            <TextField name="province" variant="outlined" label="Province" fullWidth value={locationData.province} onChange={(e) => setLocationData({...locationData, province: e.target.value})} />
            <TextField name="mainLocation" variant="outlined" label="Main Location" fullWidth multiline rows={4} value={locationData.mainLocation} onChange={(e) => setLocationData({...locationData, mainLocation: e.target.value})}  />
            <TextField name="subLocation" variant="outlined" label="Sub Location" fullWidth value={locationData.subLocation} onChange={(e) => setLocationData({ ...locationData, subLocation: e.target.value})} />

            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
            <Button variant="contained" color="secondary" size="small"  fullWidth>Clear</Button>
      </form>
    </Paper>
    )
}

export default Location;