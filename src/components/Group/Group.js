import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { createGroup, getGroups } from '../../actions/group';
import useStyles from './styles';

const Group = () => {

    const [groupData, setGroupData] = useState({ name: ''});

    const dispatch = useDispatch();
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('profile'));
    const groups = useSelector(state => state.groups)

    useEffect(() => {
        dispatch(getGroups());
    }, [groups])


  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(createGroup(groupData));

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
      <Grid style={{ display: 'flex'}} container spacing={9}>

      <Grid style={ {paddingTop: '50px' }} item lg={12} sm={12} xs={12}>
            <Paper className={classes.addGroupForm} elevation={6}>
              <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                  <Typography className={classes.Header} variant="h6"> Add Group </Typography>

                  <TextField name="name" variant="outlined" label="Group" fullWidth value={groupData.name} onChange={(e) => setGroupData({...groupData, name: e.target.value})} />
                  <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
                  <Button variant="contained" color="secondary" size="small"  fullWidth>Clear</Button>
              </form>
            </Paper>
        </Grid>

        <Grid style={ {paddingBottom: '99px',marginTop: '3px' }} item lg={12} sm={12} xs={12}>
          <Paper className={classes.groupListPaper} elevation={6}>
          <Typography variant="h6"> List of group </Typography>
              {groups?.map((g => (<ul>
                  <li> <Typography variant="h9"> {g.name} </Typography></li>
              </ul>
            )))}
            </Paper>
        </Grid>

      </Grid>

    </>
    )
}

export default Group;