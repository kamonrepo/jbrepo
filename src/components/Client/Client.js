import React, { useEffect, useState } from 'react';
import { Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, Slide, DialogTitle, TextField, Button, Typography, Paper, Select, MenuItem, Radio, RadioGroup, FormControlLabel, FormControl, InputLabel } from '@material-ui/core';
import { Warning } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../actions/group';
import { getSublocs } from '../../actions/sublocation';
import { getTargetLocs } from '../../actions/targetlocation';
import { createClient } from '../../actions/client';
import { getCategory } from '../../actions/services/category';
import { getPlan } from '../../actions/services/plan';
import useStyles from './styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Client = () => {

  const groups = useSelector(state => state.groups);
  const sublocations = useSelector(state => state.sublocations);
  const targetlocations = useSelector(state => state.targetlocations);
  const categories = useSelector(state => state.categories);
  const plans = useSelector(state => state.plan);

  const initState = { 
    targetlocId: '', targloc:'',  name: '', ipaddr: '', contactNumber: '', 
    category: '', plan: '', planName: '', dueDate: '15th', monthlyFee: '', 
    firstPayment:'', address: '' 
  }

  //modal sate
  const [open, setOpen] = useState(false);
  const [preSubmitOpt, SetPreSubmitOpt] = useState(false); //false=back; true=proceed
  
  const [clientData, setClientData] = useState(initState);

  const [sublocData, setSublocData] = useState({ name: '', groupId: '' });
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState('');
  const [ggroup, setGgroup] = useState('');
  const [ssubloc, setSsubloc] = useState('');
  const [ttargloc, setTtargloc] = useState('');
  const [selectedCategId, setSelectedCategId] = useState('');
  const [sublocDataByGroupId, setSublocDataByGroupId] = useState([]);
  const [targetlocDataBySublocId, setTargetlocDataBySublocId] = useState([]);
  const [nextMonth, setNextMonth] = useState(null);

  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    dispatch(getGroups());
    dispatch(getSublocs());
    dispatch(getTargetLocs());
    dispatch(getCategory());

    const currentDate = new Date();
    const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    const options = { month: 'long' }; // Specify the format of the month

    setNextMonth(nextMonthDate.toLocaleDateString(undefined, options));

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

  const handleClose = () => {
    setOpen(prev => prev = false);
    SetPreSubmitOpt(prev => prev=false);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    SetPreSubmitOpt(prev => prev = true);
    setOpen(prev => prev = false);
    dispatch(createClient(clientData));
    setClientData(initState);

    setGgroup('');
    setSsubloc('');
    setTtargloc('');
    setCategory('');
    setPlan('');

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setOpen(true);
     SetPreSubmitOpt(prev => prev=true);
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

  const ipAddrHandleChange = (e) => {
    const inputValue = e.target.value;
    const ipRegex = /^([0-9]{1,3}\.){0,3}[0-9]{0,3}$/;

    if (ipRegex.test(inputValue) || inputValue === '') {
      setClientData({ ...clientData, ipaddr: inputValue });
    }
  };

  const dontTypeHere = (e) => {
    e.preventDefault(); // Prevent typing
  };

  return (     
    <div>  
        <form onSubmit={handleSubmit}>
          <Paper elevation={9} style={{ backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
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
                  <Select labelId="demo-select-small-label" id="demo-select-small" fullWidth value={ssubloc} onChange={e => SubLocationOnChange(e.target.value)}>
                    {sublocDataByGroupId.map((data) => (
                      <MenuItem key={data._id} value={data._id}>{data.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                <InputLabel id="demo-select-small-label">LOCATION</InputLabel>
                  <Select labelId="demo-select-small-label" id="demo-select-small" fullWidth value={ttargloc} onChange={e => TargetLocationOnChange(e.target.value)}>
                    {targetlocDataBySublocId.map(tl => (
                      <MenuItem key={tl._id} value={tl._id}>{tl.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
       
              <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
                <TextField id="tfOne" required className={classes.textFields} name="name" variant="outlined" label="Registered name" value={clientData.name} onChange={(e) => setClientData({...clientData, name: e.target.value})} />
                <TextField id="tfTwo" required className={classes.textFields} name="address" variant="outlined" label="Address" value={clientData.address} onChange={(e) => setClientData({...clientData, address: e.target.value})} />
                <TextField id="tfThree" required className={classes.textFields} name="contactNumber" variant="outlined" label="Contact Number" value={clientData.contactNumber} onChange={(e) => setClientData({...clientData, contactNumber: e.target.value})}  />
              </div>
          </Paper>
          
          <Paper elevation={9} style={{ marginTop: '33px', backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
            <FormControl>
            <InputLabel id="demo-select-small-label">PRODUCT</InputLabel>
              <Select     
                  style={{width: '200px'}} 
                  labelId="demo-select-small-label"
                  id="demo-select-small"                                            
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
            <InputLabel id="demo-select-small-label">PLAN</InputLabel>
              <Select                      
                  style={{width: '200px'}}
                  value={plan}                       
                  onChange={e => handleOnchangePlan(e.target.value)}>
                  {plans.map((data) => {
                      if(data.category === selectedCategId) {
                        return(<MenuItem key={data._id} value={data.plan}>{data.plan}</MenuItem>)                              
                      }                          
                  })}
              </Select>    
            </FormControl>

            <Tooltip title="*payment starts on">
            <Typography style={{ marginTop: '12px', fontWeight: 'bold'}}>{`${nextMonth}`}</Typography>
            </Tooltip>
            <RadioGroup defaultValue="15th" name="radio-buttons-group">
              <FormControlLabel value="15th" control={<Radio />} label="15th" onClick={(e) => setClientData({ ...clientData, dueDate: e.target.value})} />
              <FormControlLabel value="Endth" control={<Radio />} label="End month" onClick={(e) => setClientData({ ...clientData, dueDate: e.target.value})}/>
            </RadioGroup>
            </div>

            <div style={{ margin: '33px 33px 33px 33px', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
              {/* <TextField required className={classes.textFields} name="ipaddr" variant="outlined" label="IP Address" fullWidth value={clientData.ipaddr} onChange={(e) => IPADDR_handleInputChange(e)}/> */}
              <TextField
                  required
                  className={classes.textFields}
                  name="ipaddr"
                  variant="outlined"
                  label="IP Address"
                  fullWidth
                  value={clientData.ipaddr}
                  onChange={ipAddrHandleChange}
                  InputProps={{
                    inputProps: {
                      pattern: '^([0-9]{1,3}\\.){0,3}[0-9]{0,3}$',
                    },
                  }}
              />
              <TextField 
                onKeyDown={dontTypeHere} 
                required 
                className={classes.mfee} 
                name="monthlyFee" 
                variant="outlined" 
                label="Monthly Fee" 
                fullWidth 
                value={clientData.monthlyFee} 
                onChange={(e) => setClientData({ ...clientData, monthlyFee: e.target.value})}
              />
              <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth> Submit </Button>
              <Button variant="contained" color="secondary" size="small" fullWidth onClick={debugg}> Clear </Button>
            </div>
          </Paper>
        </form>
        
        <div>
          <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
              <div style={{ display: 'flex'}}>
                {"Confirmation"}<Warning style={{ paddingTop: '3px', paddingLeft: '11px'}} />
              </div>
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Please double check your information:
              </DialogContentText>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Back</Button>
              <Button onClick={handleProceed}>Proceed</Button>
            </DialogActions>

          </Dialog>
        </div>
    </div>

    
  )
}

export default Client;