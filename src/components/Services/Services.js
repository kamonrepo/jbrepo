import React, { useState, useEffect } from 'react';
import { Grid, Button, TextField, Paper, Select, MenuItem, Typography } from '@material-ui/core';
import { getCategory, createCategory } from '../../actions/services/category';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

const Services = () => {

  const categories = useSelector(state => state.categories);

  const [formData, setFormData] =  useState({ category:'' });
  const [category, setCategory] = useState('');
  const [btnState, setBtnState] = useState(false);
  const [existingSvc, setExistingSvc] = useState(false);

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
    setExistingSvc(true);
    console.log('handleOnchange-data::: ', data);
    setCategory(data);

    let categ = await categories.filter(c => c.category == data);

     setFormData({ ...formData, type: 'update', category: categ[0]._id, service: categ[0].category});
  }
    const AddServiceSubmit = async e => {
    e.preventDefault();

    console.log('ONSUBMIT formData', formData);
    console.log('category-category::: ', category);
    dispatch(createCategory(formData));
  };

  const NewPlanSubmit = async e => {
    e.preventDefault();

    setCategory('');
    setExistingSvc(false);
    setFormData({ type: 'create' });
  };

  const debugg = () => {
    console.log('category-state::: ', category);
    console.log('formData-state', formData);
  }

  const tbOnChange = value => {
    console.log('tbOnChange::: ', value);
    setCategory(value);
    setFormData({ ...formData, service: value});
  }

  return (
      <>
        <Grid class={classes.container} container >
          <Grid style={{paddingTop: '30px' }} item lg={12} sm={12} xs={12}>
            <Paper class={classes.Paper} elevation={9}>
              <form class={classes.form} autoComplete="off" onSubmit={AddServiceSubmit}>
                  <div class={classes.createButton}>
                    <Button variant="text" onClick={(e) => NewPlanSubmit(e)}><b style={{color:'green'}}>* create new</b></Button>
                  </div>
                {(categories.length > 0) 
                ? (
                  <div>
                    <Typography>SELECT SERVICE &nbsp;&nbsp;</Typography>      
                    <Select 
                      fullWidth
                      style={{paddingBottom: '.3em'}} 
                      className={classes.Select}                   
                      value={category} 
                      onChange={e => handleOnchange(e.target.value)}>
                        {categories.map((data) => (
                          <MenuItem key={data._id} value={data.category}>{data.category}</MenuItem>
                        ))}
                    </Select>
                    <TextField required fullWidth onChange={(e) => tbOnChange(e.target.value)} value={category} style={{paddingBottom: '.9em'}}  name="category" variant="outlined"/>

                  </div>
                )
                : null 
                }

                <Button variant="contained" color="primary" size="large" type="submit"> {`${btnState? 'EDIT' : 'SAVE'}`} SERVICE </Button>
                {/* <Button variant="contained" color="primary" size="large" onClick={debugg}> debugg </Button> */}
              </form>
            </Paper>
          </Grid>
        </Grid>
    </>
  );
};

export default Services;
