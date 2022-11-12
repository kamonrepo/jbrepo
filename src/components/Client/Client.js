import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Paper, Select, MenuItem, InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../actions/group';
import { createClient } from '../../actions/client';
import { getCategory } from '../../actions/services/category';
import { getPlan } from '../../actions/services/plan';

import useStyles from './styles';

const Client = () => {

  const groups = useSelector(state => state.groups);
  const categories = useSelector(state => state.categories);
  const plans = useSelector(state => state.plan);

  const [clientData, setClientData] = useState({ group:'', name: '', contactNumber: '', category: '', plan: '', planName: '', dueDate: '', monthlyFee: '', address: '' });
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState('');
  const [group, setGroup] = useState('');
  const [selectedCategId, setSelectedCategId] = useState('');

  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    dispatch(getGroups());
    dispatch(getCategory());

  }, [])

  //group dropdown list
  const handleOnchange = data => {
    setGroup(data);
    let group = groups.filter(g => g.name == data);

    setClientData({ ...clientData, group: group[0]._id});
  };

  const handleOnchangeCategory = data => {

    setCategory(data);
    dispatch(getPlan());

    let category = categories.filter(c => c.category == data);

    setClientData({ ...clientData, category: category[0]._id});
    setSelectedCategId(category[0]._id);
 };

 const handleOnchangePlan = data => {
  setPlan(data);

  let selectedPlan = plans.filter(p => p.plan == data);
     setClientData({ ...clientData, plan: selectedPlan[0]._id, planName: selectedPlan[0].plan});
 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('clientData::: ', clientData);
    dispatch(createClient(clientData));
  };

  const categoryOnClick = () => {

  };

  const debugg = e => {
    e.preventDefault();
    console.log('clientData:: ', clientData);
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
      <Paper className={classes.paper} elevation={9}>
        <form onSubmit={handleSubmit}>
            <Typography className={classes.Header} variant="h6"><b>ADD CLIENT</b></Typography>

            <InputLabel id="demo-simple-select-standard-label"><b>&nbsp;assigned group</b></InputLabel>
            <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" className={classes.Select} fullWidth value={group} onChange={e => handleOnchange(e.target.value)}>
              {groups.map((data) => (
                <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
              ))}
            </Select>

            <TextField required className={classes.textFields} name="name" variant="outlined" label="Registered name" fullWidth value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} />
            <TextField required className={classes.textFields} name="contactNumber" variant="outlined" label="Contact Number" fullWidth multiline rows={4} value={clientData.contactNumber} onChange={(e) => setClientData({...clientData, contactNumber: e.target.value})}  />
           
            <InputLabel id="demo-simple-select-standard-label"><b>&nbsp;PRODUCT</b></InputLabel>
            <Select                      
                style={{paddingBottom: '.3em'}} 
                labelId="demo-simple-select-standard-label" 
                id="demo-simple-select-standard" 
                className={classes.Select}                             
                value={category} 
                visible={false}
                onClick={categoryOnClick}
                onChange={e => handleOnchangeCategory(e.target.value)}>

                {categories.map((data) => (
                  <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                ))}
            </Select>   

            <InputLabel id="demo-simple-select-standard-label"><b>&nbsp;PLAN</b></InputLabel>
            <Select                      
                style={{paddingBottom: '.3em'}} 
                labelId="demo-simple-select-standard-label" 
                id="demo-simple-select-standard" 
                className={classes.Select} 
                fullWidth
                value={plan}                       
                onChange={e => handleOnchangePlan(e.target.value)}>

                {plans.map((data) => {
                    if(data.category === selectedCategId) {
                      return(<MenuItem key={data._id} value={data.plan}>{data.plan}</MenuItem>)                              
                    }                          
                })}
              </Select>    
            
            <TextField required className={classes.textFields} name="dueDate" variant="outlined" label="Due Date" fullWidth value={clientData.dueDate} onChange={(e) => setClientData({ ...clientData, dueDate: e.target.value})}/>
            <TextField required className={classes.textFields} name="monthlyFee" variant="outlined" label="Monthly Fee" fullWidth value={clientData.monthlyFee} onChange={(e) => setClientData({ ...clientData, monthlyFee: e.target.value})}/>
            <TextField required className={classes.textFields} name="address" variant="outlined" label="Address" fullWidth value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} />
          
            <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth> Submit </Button>
            <Button variant="contained" color="secondary" size="small" fullWidth onClick={debugg}> Clear </Button>
      </form>
    </Paper>
    </>
  )
}

export default Client;