import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, Paper, Select, MenuItem, InputLabel, Typography, Link } from '@material-ui/core';
import { getCategory, createCategory } from '../../actions/services/category';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

const Services = () => {

  const categories = useSelector(state => state.categories);

  const [formData, setFormData] = 
  useState({  category:'',
              service: ''
          });

  const [category, setCategory] = useState('');
  const [btnState, setBtnState] = useState(false);
  const [existingSvc, setExistingSvc] = useState(false);

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect( () => {
     dispatch(getCategory());

     console.log('useEffect[]-dispatch-getCategory-getPlan');
  }, [])

  const handleOnchange = async data => {
    setExistingSvc(true);
    setCategory(data);

    let category = await categories.filter(c => c.category == data);

    setFormData({ ...formData, category: category[0]._id});
  }

    const AddServiceSubmit = async e => {
    e.preventDefault();
    // dispatch(createCategory());
  };

  const NewPlanSubmit = async e => {
    e.preventDefault();

    setExistingSvc(false);
  };

  const ServiceHandleOnChange = e => {
    setFormData({ ...formData, service: e});
  }

  return (
    <>
      <Grid style={{ display: 'flex'}} container spacing={9}>
        <Grid style={{paddingTop: '50px' }} item lg={12} sm={12} xs={12}>
          <Paper className={''} elevation={6}>
            <form autoComplete="off" className={''} onSubmit={AddServiceSubmit}>
              <InputLabel style={{paddingBottom: '.3em'}} id="demo-simple-select-standard-label">
                <div style={{ display: 'flex'}}>
                <Typography>SELECT SERVICE &nbsp;&nbsp;</Typography>         
                  <Button className={''} variant="contained" color="primary" size="large" type="submit" onClick={NewPlanSubmit}>*new</Button>
                </div>
              </InputLabel>

              <Select style={{paddingBottom: '.3em'}} labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" className={classes.Select} fullWidth value={category} onChange={e => handleOnchange(e.target.value)}>
                {categories.map((data) => (
                  <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                ))}
              </Select>

              <TextField style={{paddingBottom: '.9em'}}  name="category" variant="outlined"   fullWidth  onChange={ e => ServiceHandleOnChange(e.target.value)} />
              <Button variant="contained" color="primary" size="large" type="submit" fullWidth> {`${btnState? 'EDIT' : 'SAVE'}`} SERVICE </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Services;
