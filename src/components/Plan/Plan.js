import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Select, MenuItem, Typography } from '@material-ui/core';
import { getCategory } from '../../actions/services/category';
import { getPlanByCategoryId, createPlan } from '../../actions/services/plan';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

const Plan = () => {

  const categories = useSelector(state => state.categories);
  const plans = useSelector(state => state.plan);

  const [formData, setFormData] = 
  useState({  
            type:'',
            category:'',
            planId:'',
            plan: '',
            price: ''
          });

  const [category, setCategory] = useState('');
  const [plan, setPlan] = useState('');
  const [planHeader, setPlanHeader] = useState({ head: '' });
  const [selectedCategId, setSelectedCategId] = useState('');

  const dispatch = useDispatch();
  const classes = useStyles();

  const init = () => {
    if(plans.length == 0) {
      setFormData({ ...formData, type: 'create'});
    }
  }

  useEffect(() => {
     dispatch(getCategory());
     init();

     console.log('useEffect[]-dispatch-getCategory-getPlan');
  }, []);


  const handleOnchangeCategory = data => {
     console.log('handleOnchangeCategory-data:: ', data);
     setCategory(data);

     let category = categories.filter(c => c.category == data);
     let CID =  category[0]._id;

     console.log('CID::: ', CID);

     dispatch(getPlanByCategoryId(CID));
     setPlanHeader({...planHeader, head: data});
     setFormData({ ...formData, category: CID});
     setSelectedCategId(CID);
  }

  const handleOnchangePlan = data => {
      setPlan(data);
      console.log('plan data::: ', data);

      let selectedPlan = plans.filter(p => p.plan == data);
      setFormData({...formData, plan: selectedPlan[0].plan, price: selectedPlan[0].price});
  };

  const AddPlanSubmit = async e => {
    e.preventDefault();

    //todo::: validate ung plan name para unique/no-duplicates
    console.log('plan-formData:: ', formData);
    dispatch(createPlan(formData));
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
    console.log('category--- ', formData);
    console.log('plan--- ', plans);
  }

  return (
      <Paper className={classes.paper} elevation={6}>
          <form autoComplete="off" className={classes.form} onSubmit={AddPlanSubmit}>
              <Typography>SELECT SERVICE &nbsp;&nbsp;</Typography> 
              <Select                      
                  style={{paddingBottom: '.3em'}} 
                  labelId="demo-simple-select-standard-label" 
                  id="demo-simple-select-standard" 
                  className={classes.Select}                             
                  value={category} 
             
                  onChange={e => handleOnchangeCategory(e.target.value)}>

                  {categories.map((data) => (
                    <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                  ))}
              </Select>     

              <div className={classes.createButton}>
                <Button variant="text" onClick={newPlanOnClick}><b style={{color:'green' }}>* create new plan</b></Button>
              </div>

              {
                (plans && plans.length > 0) ? (
                  <>
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
                  </>
                ) : (
                  <>
                    {
                      (formData.category != null || formData.category != '') 
                      ? <Typography>No plan record/s</Typography>
                      : <Typography>SELECT PLAN</Typography>
                    }
                  
                  </>
                )
              }
        
                  
              <TextField style={{paddingBottom: '.9em'}} required name="plan" variant="outlined" label="Plan" fullWidth  value={formData.plan} onChange={(e) => setFormData({ ...formData, plan: e.target.value})} />   
              <TextField style={{paddingBottom: '.9em'}} required name="planPrice"  variant="outlined" label="Price" fullWidth value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value})} />
              
              <Button variant="contained" color="primary" size="large" type="submit">{formData && formData.type == 'create' ? 'CREATE' : 'UPDATE'}</Button>
              {/* <Button variant="contained" color="primary" size="large" onClick={debugg}>DEBUGG</Button> */}
          </form>
      </Paper>
  );


};

export default Plan;
