import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Paper, Select, MenuItem, Container, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, InputLabel} from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../actions/group';
import { getSublocs } from '../../actions/sublocation';
import { getTargetLocs } from '../../actions/targetlocation';
import { createClient } from '../../actions/client';
import { getCategory } from '../../actions/services/category';
import { getPlan } from '../../actions/services/plan';
import useStyles from './styles';

const Client = () => {

  const groups = useSelector(state => state.groups);
  const sublocations = useSelector(state => state.sublocations);
  const targetlocations = useSelector(state => state.targetlocations);
  const categories = useSelector(state => state.categories);
  const plans = useSelector(state => state.plan);
  
  const [clientData, setClientData] = 
  useState({ 
      targetlocId: '', targloc:'',  name: '', ipaddr: '', contactNumber: '', 
      category: '', plan: '', planName: '', dueDate: '', monthlyFee: '', 
      firstPayment:'', address: '' 
  });

  const [sublocData, setSublocData] = useState({ name: '', groupId: '' });
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState('');
  const [ggroup, setGgroup] = useState('');
  const [ssubloc, setSsubloc] = useState('');
  const [ttargloc, setTtargloc] = useState('');
  const [selectedCategId, setSelectedCategId] = useState('');
  const [sublocDataByGroupId, setSublocDataByGroupId] = useState([]);
  const [targetlocDataBySublocId, setTargetlocDataBySublocId] = useState([]);

  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    dispatch(getGroups());
    dispatch(getSublocs());
    dispatch(getTargetLocs());
    dispatch(getCategory());

  }, [])

  const debugg = e => {
    e.preventDefault();
    console.log('clientData:: ', clientData);
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
  console.log(' selectedPlan[0].monthlyFee::: ',  selectedPlan[0].price);
     setClientData({ ...clientData, plan: selectedPlan[0]._id, planName: selectedPlan[0].plan, monthlyFee: selectedPlan[0].price});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('clientData::: ', clientData);
    dispatch(createClient(clientData));
  };

  const categoryOnClick = () => {

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
     let holdTargloc = [];

    if(groups){
      Object.keys(targetlocations).forEach(i => {
        if(targetlocations[i].sublocId == sublocId) {
          holdTargloc.push({ _id:  targetlocations[i]._id, name: targetlocations[i].name});
        }
      })
      setTargetlocDataBySublocId(holdTargloc);
    }
  };

  const TargetLocationOnChange = data => {
    setTtargloc(data);

    let tlName = "";

    if(targetlocations){
      Object.keys(targetlocations).forEach(i => {
        if(targetlocations[i]._id == data) {
          tlName = targetlocations[i].name;
        }
      })
    }

    setClientData({ ...clientData, targetlocId: data, targetloc: tlName });
  };

  return (     
    <Container component="main" maxWidth="xs">     
    <Paper className={classes.paper} elevation={9}>
        <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Location</FormLabel>
            <Select className={classes.Select} fullWidth value={ggroup} onChange={e => LocationOnChange(e.target.value)}>
              {groups.map((data) => (
                <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Sub Location</FormLabel>
            <Select className={classes.Select} fullWidth value={ssubloc} onChange={e => SubLocationOnChange(e.target.value)}>
              {sublocDataByGroupId.map((data) => (
                <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            {/* targetloc */}
            <FormLabel>Target Location</FormLabel>
            <Select className={classes.Select} fullWidth value={ttargloc} onChange={e => TargetLocationOnChange(e.target.value)}>
              {targetlocDataBySublocId.map(tl => (
                <MenuItem key={tl._id} value={tl._id}>{tl.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
            
          <TextField id="tfOne" required className={classes.textFields} name="name" variant="standard" label="Registered name" fullWidth value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} />
          <TextField id="tfTwo" required className={classes.textFields} name="address" variant="outlined" label="Address" fullWidth value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} />
          <TextField id="tfThree" required className={classes.textFields} name="contactNumber" variant="outlined" label="Contact Number" fullWidth value={clientData.contactNumber} onChange={(e) => setClientData({...clientData, contactNumber: e.target.value})}  />
          
          <FormControl>
            <FormLabel>Product</FormLabel>
            <Select                      
                style={{paddingBottom: '.3em'}} 
                className={classes.Select}                             
                value={category} 
                visible="false"
                onClick={categoryOnClick}
                onChange={e => handleOnchangeCategory(e.target.value)}>

                {categories.map((data) => (
                  <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                ))}
            </Select>   
          </FormControl>
            
          <FormControl>
            <FormLabel>Plan</FormLabel>
            <Select                      
                style={{paddingBottom: '.3em'}} 
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
          </FormControl>

          <FormLabel id="demo-radio-buttons-group-label">Due Date</FormLabel>
          <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="15th" name="radio-buttons-group">
            <FormControlLabel value="15th" control={<Radio />} label="15th of month" onClick={(e) => setClientData({ ...clientData, dueDate: e.target.value})} />
            <FormControlLabel value="Endth" control={<Radio />} label="End of month" onClick={(e) => setClientData({ ...clientData, dueDate: e.target.value})}/>
          </RadioGroup>
    
          <TextField required className={classes.textFields} name="ipaddr" variant="outlined" label="IP Address" fullWidth value={clientData.ipaddr} onChange={(e) => setClientData({ ...clientData, ipaddr: e.target.value})}/>
          <TextField required className={classes.textFields} name="monthlyFee" variant="outlined" label="Monthly Fee" fullWidth value={clientData.monthlyFee} onChange={(e) => setClientData({ ...clientData, monthlyFee: e.target.value})}/>
          <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth> Submit </Button>
          <Button variant="contained" color="secondary" size="small" fullWidth onClick={debugg}> Clear </Button>
        </form>
    </Paper>
    </Container>
  )
}

export default Client;