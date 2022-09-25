import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, Paper, Select, MenuItem, InputLabel, Typography } from '@material-ui/core';
import { getCategory } from '../../actions/services/category';
import { getPlan, createPlan } from '../../actions/services/plan';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

const Plan = () => {

  const categories = useSelector(state => state.categories);
  const plans = useSelector(state => state.plan);
  const [formData, setFormData] = 
  useState({  
            type:'',
            category:'',
            plan: '',
            price: ''
          });
  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState('');
  const [planHeader, setPlanHeader] = useState({ head: '' });
  const [selectedCategId, setSelectedCategId] = useState('');
  const [show, setShow] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
     dispatch(getCategory());
    // dispatch(getPlan());

     console.log('useEffect[]-dispatch-getCategory-getPlan');
  }, []);

  const categoryOnClick = () => {
    setFormData({ ...formData, price:'', plan: ''});
  }

  const handleOnchangeCategory =  data => {

     setCategory(data);
     dispatch(getPlan());

     let category = categories.filter(c => c.category == data);

     setPlanHeader({...planHeader, head: data});
     setFormData({ ...formData, category: category[0]._id});
     setSelectedCategId(category[0]._id);
  }

  const handleOnchangePlan = data => {
      setPlan(data);

      let selectedPlan = plans.filter(p => p.plan == data);
      setFormData({...formData, plan: selectedPlan[0].plan, price: selectedPlan[0].price});
  };

  const AddPlanSubmit = async e => {
    e.preventDefault();

    //todo::: validate ung plan name para unique/no-duplicates
    console.log('plan-formData:: ', formData);
    //dispatch(createPlan(formData));
  };

  const newPlanOnClick = e => {
    e.preventDefault();

    setPlan('');
    setFormData({...formData, 
                    type: 'create',
                    plan: '',
                    price: ''                   
               });
  }

  const debugg = () => {

    console.log('debugg-formData', formData);
  }

  return (
    <>
        <Grid style={{ display: 'flex'}} container spacing={9}>
            <Grid style={{paddingBottom: '99px',marginTop: '3px' }} item lg={12} sm={12} xs={12}>
                <Paper className={classes.groupListPaper} elevation={6}>
                    <form autoComplete="off" className={''} onSubmit={AddPlanSubmit}>
                        <InputLabel style={{paddingBottom: '.3em'}} id="demo-simple-select-standard-label"> SERVICE</InputLabel>
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

                        <Typography style={{paddingLeft: '.9em', paddingBottom: '.9em'}}> 
                          {`${planHeader.head}`} PLAN | 
                            <Button variant="contained" color="primary" type="submit" onClick={newPlanOnClick}>*new</Button> 
                        </Typography>   

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
                                return(
                                  <MenuItem key={data._id} value={data.plan}>{data.plan}</MenuItem>
                                )                              
                            }                          
                        })}
                        </Select>                       
                            
                        <TextField style={{paddingBottom: '.9em'}} required name="plan" variant="outlined" label="Plan" fullWidth  value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value})} />   
                        <TextField style={{paddingBottom: '.9em'}} required name="planPrice"  variant="outlined" label="Price" fullWidth value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value})} />
                       
                        <Button variant="contained" color="primary" size="large" type="submit">UPDATE</Button>
                        <Button variant="contained" color="primary" size="large" type="submit" onClick={debugg}>DEBUGG</Button>
                    </form>
                </Paper>
            </Grid>
      </Grid>
    </>
  );


};

export default Plan;
