import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBillrun, getBillrun } from '../../actions/billrun';
import { getGroups } from '../../actions/group';
import { Grid, TextField, Button } from '@material-ui/core';
import Tags from './Tags';

const BillRun = () => {

    const dispatch = useDispatch();
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
        const today = temp.getFullYear() + '-' +temp.getDate();
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

        console.log('builded-payload::: ', payload);

        dispatch(createBillrun(payload));
    }

    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3} >
                <Grid item lg={6} md={12} sm={12} xs={12}>
                    <Tags  
                        grpNames={grpNames} 
                        setGrpNames={setGrpNames} 
                        grpIds={grpIds} 
                        setGrpIds={setGrpIds} 
                        groups={groups} 
                        selectedGRP={selectedGRP} 
                        setSelectedGRP={setSelectedGRP}/>

                    <TextField name="id" variant="outlined" label="ID" onChange={(e) => setId(e.target.value)} />
                    <Button fullWidth variant="contained" color="primary" size="large" type="submit">✓</Button>
                </Grid>

            </Grid>
        </form>
    );
}

export default BillRun;