import React, { useState, useEffect } from 'react';
import { Grid, Button, Divider, TextField, Paper, Select, MenuItem, InputLabel } from '@material-ui/core';
import { getCategory, createCategory } from '../../actions/services/category';
import { getPlan, createPlan } from '../../actions/services/plan';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
const Services = () => {

  const categories = useSelector(state => state.categories);
  const [clientData, setClientData] = 
  useState({  category:'',
              name: '', 
              contactNumber: '',
              package: '', 
              dueDate: '', 
              monthlyFee: '', 
              address: '' });

  const [category, setCategory] = useState('');
  const [btnState, setBtnState] = useState('');

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect( () => {
     dispatch(getCategory());
  }, [])

  const handleOnchange = data => {
    setCategory(data);
    let category = categories.filter(c => c.category == data);

    console.log('setClientData:: ', JSON.stringify({ ...clientData, category: category[0]._id}));

    setClientData({ ...clientData, category: category[0]._id});
  }

    const AddServiceSubmit = async e => {
    e.preventDefault();
    // dispatch(createPlan());
  };

  const AddPlanSubmit = async e => {
    e.preventDefault();
    // dispatch(createPlan());
  };

  return (
    <>
      <Grid style={{ display: 'flex'}} container spacing={9}>

        <Grid style={{paddingTop: '50px' }} item lg={12} sm={12} xs={12}>
          <Paper className={''} elevation={6}>
            <form autoComplete="off" className={''} onSubmit={AddServiceSubmit}>
              <InputLabel id="demo-simple-select-standard-label"><b>&nbsp;SERVICE</b></InputLabel>
              <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" className={classes.Select} fullWidth value={category} onChange={e => handleOnchange(e.target.value)}>
                {categories.map((data) => (
                  <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                ))}
              </Select>

              <TextField required name="category" variant="outlined" label="Service" fullWidth value={category} onChange={(e) => console.log('what')} />
              <Button className={''} variant="contained" color="primary" size="large" type="submit" fullWidth> {`${btnState? 'EDIT' : 'ADD'}`} SERVICE</Button>
            </form>
          </Paper>
        </Grid>

        <Grid style={{paddingBottom: '99px',marginTop: '3px' }} item lg={12} sm={12} xs={12}>
          <Paper className={classes.groupListPaper} elevation={6}>
            <form autoComplete="off" className={''} onSubmit={AddPlanSubmit}>
              <InputLabel id="demo-simple-select-standard-label"><b>&nbsp; {category} PLAN</b></InputLabel>
              <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" className={classes.Select} fullWidth value={category} onChange={e => handleOnchange(e.target.value)}>
                {categories.map((data) => (
                  <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                ))}
              </Select>

              <TextField required name="plan" variant="outlined" label="Plan" fullWidth value={''} onChange={(e) => console.log('what')} />
    
              <TextField required name="planPrice" style={{paddingTop:'1em'}} variant="outlined" label="Price" fullWidth value={category} onChange={(e) => console.log('what')} />
              
              <Button className={''} variant="contained" color="primary" size="large" type="submit" fullWidth>ADD PLAN</Button>
            </form>
          </Paper>
        </Grid>

      </Grid>
    </>
  );

};

export default Services;
