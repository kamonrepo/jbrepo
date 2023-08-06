import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBillrun, getBillrun } from '../../actions/billrun';
import { getGroups } from '../../actions/group';
import { Grid, TextField, Button, Paper, Container } from '@material-ui/core';
import Tags from './Tags';
import useStyles from './styles';

const BillRun = () => {

    const dispatch = useDispatch();
    const classes = useStyles();

    const groups = useSelector(state => state.groups);
    const [id, setId] = useState(0);
    const [selectedGRP, setSelectedGRP] = useState([]);
    const [grpIds, setGrpIds] = useState([]);
    const [grpNames, setGrpNames] = useState([]);
    useEffect(() => {
        dispatch(getBillrun());
        dispatch(getGroups());
    }, [])


    const handleSubmit = e => {
        e.preventDefault();

        const temp = new Date();
        const today = temp.getFullYear() + '-' + temp.getDate() + '-' + temp.getHours() + '-' + temp.getMilliseconds();
        let uniqueId =  today + '-' + id.toString();

        let payload = { newWOs: uniqueId }
        let buildMergedGroup = [];

        for(let index in grpNames) {
            buildMergedGroup.push(
                {
                    id:  grpIds[index],
                    name:  grpNames[index]
                }
        )}

        Object.assign(payload, {mergedGroup: buildMergedGroup});
        console.log('dispatch::: ', payload);
        dispatch(createBillrun(payload));
    }

    return(
        <Container component="main" maxWidth="xs" >
            <Paper className={classes.paper} elevation={9}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid className={classes.maincon} container>
                        <Grid className={classes.tags} item lg={12} md={12} sm={12} xs={12}>
                            <Tags                 
                                grpNames={grpNames} 
                                setGrpNames={setGrpNames} 
                                grpIds={grpIds} 
                                setGrpIds={setGrpIds} 
                                groups={groups} 
                                selectedGRP={selectedGRP} 
                                setSelectedGRP={setSelectedGRP}
                            />
                        </Grid>

                        <Grid className={classes.id} item lg={12} md={12} sm={12} xs={12}>
                            <TextField fullWidth required name="id" variant="outlined" label="ID" onChange={(e) => setId(e.target.value)} />
                        </Grid>

                        <Grid className={classes.submit} item lg={12} md={12} sm={12} xs={12}>
                            <Button fullWidth variant="contained" color="primary" size="large" type="submit"><b>SUBMIT</b></Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default BillRun;