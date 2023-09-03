import React, { useState, useEffect } from 'react';
import { Button, TextField, Paper, Select, MenuItem, Typography } from '@material-ui/core';
import { getCategory, createCategory } from '../../actions/services/category';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

const Services = () => {

  const categories = useSelector(state => state.categories);
  const [formData, setFormData] =  useState({ category:'' });
  const [category, setCategory] = useState('');

  const dispatch = useDispatch();
  const classes = useStyles();

  const init = () => {
    if(categories.length == 0) {
      console.log('init create');
      setFormData({ ...formData, type: 'create'});
    }
  }

  useEffect( () => {
     dispatch(getCategory());
     init();
     console.log('useEffect-dispatch-getCategory');
  }, [])

  const handleOnchange = async data => {

    console.log('handleOnchange-data::: ', data);
    setCategory(data);

    let categ = await categories.filter(c => c.category == data);

    setFormData({ ...formData, type: 'update', category: categ[0]._id, service: categ[0].category});
  }
    const AddServiceSubmit = async e => {
    e.preventDefault();

    console.log('ONSUBMIT formData', formData);
    dispatch(createCategory(formData));
  };

  //create new service
  const NewPlanSubmit = async e => {
    e.preventDefault();

    setCategory('');
    setFormData({ type: 'create' });
  };

  const tbOnChange = value => {
    console.log('tbOnChange::: ', value);
    setCategory(value);
    setFormData({ ...formData, service: value});
  }

  return (
        <Paper className={classes.Paper} elevation={9}>
          <form className={classes.form} autoComplete="off" onSubmit={AddServiceSubmit}>
              <div className={classes.createButton}>
                <Button variant="text" onClick={(e) => NewPlanSubmit(e)}><b style={{color:'green' }}>* create new service</b></Button>
              </div>
            {(categories.length > 0) 
            ? (
              <div>
                <Typography style={{ fontWeight: 'bold'}}>SELECT SERVICE &nbsp;&nbsp;</Typography>      
                <Select 
                  style={{paddingBottom: '.3em', width: '333px'}} 
                  className={classes.Select}                   
                  value={category} 
                  onChange={e => handleOnchange(e.target.value)}>
                    {categories.map((data) => (
                      <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                    ))}
                </Select>
              </div>
            )
            : null 
            }
            <TextField label={`${formData.type == 'create' ? 'CREATE SERVICE' : 'UPDATE SERVICE'}`} required onChange={(e) => tbOnChange(e.target.value)} value={category} style={{paddingBottom: '.9em'}}  name="category" variant="outlined"/>
            <Button variant="contained" color="primary" size="large" type="submit"> {`${formData.type == 'create' ? 'CREATE' : 'UPDATE'}`} </Button>
          </form>
        </Paper>
  );
};

export default Services;
