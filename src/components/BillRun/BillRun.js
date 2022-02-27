import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBillrun, getBillrun } from '../../actions/billrun';
import { getGroups } from '../../actions/group';
import { Grid, GridItem, TextField, Button, Paper, Select, MenuItem } from '@material-ui/core';

const BillRun = () => {

    const dispatch = useDispatch();

    const groups = useSelector(state => state.groups)
    const billruns = useSelector(state => state.billruns);
    const [id, setId] = useState(0);
    const [brc, setBRC] = useState({  id: '', newWOs:'', groupName: ''});
    const [group, setGroup] = useState('');

    useEffect(() => {
        dispatch(getBillrun());
        dispatch(getGroups());
    }, [])

    const handleSubmit = e => {
        e.preventDefault();

        const temp = new Date();
        const today = temp.getFullYear() + '-' +temp.getDate();
        let req =  today + '-' + id.toString();

        dispatch(createBillrun({newWOs: req, groupName: group}));
    }

    const handleOnchange = group => {
        setGroup(group);
    }

    return(
        <form onSubmit={handleSubmit}>
            <Grid container spacing={3} >
                <Grid item lg={6} md={12} sm={12} xs={12}>
                    <Select fullWidth value={group} onChange={e => handleOnchange(e.target.value)}>
                        {groups.map((data) => (
                            <MenuItem key={data.id} value={data.name}>{data.name}</MenuItem>
                        ))}
                    </Select>
                    <TextField name="id" variant="outlined" label="ID" onChange={(e) => setId(e.target.value)} />
                    <Button fullWidth variant="contained" color="primary" size="large" type="submit">✓</Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default BillRun;