import React, { useState, useEffect } from 'react';
import { Button, Grow } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { generateBRCviaAlert, getBRCByBRId, checkLatestBRC } from '../../actions/billruncandidate';

export default function BRAlert({ marvsCurrentMonth, marvsCurrentYear, bbr, marvs12MOS, findCurrentMOS, selectedMonthPeriodMOS, selectedMonthPeriodYEAR, brcData }) {

    const dispatch = useDispatch();
    const brs = useSelector((state) => state.billruns);

    const [alertGenVisible, setAlertGenVisible] = useState('visible');

    useEffect(() => {

        let isCanceled = false;
    
        if(!isCanceled) {
            console.log('[BRAlert]');

            if(brcData.length !== 0) {
                setAlertGenVisible('hidden');
            }
        }
    
        return () => {
            isCanceled = true;
        }      
                
    }, [brcData]);
    
    const generateBRC = async () => {

        let findMOSID = marvs12MOS.find((mos) => mos.code === selectedMonthPeriodMOS);
        let mp = `${findMOSID.id}/01/${selectedMonthPeriodYEAR}`;
        let holdTargetlocId = null;

        if(brs.length !== 0) {
            Object.keys(brs).forEach(index => {
                if(brs[index]._id == bbr) {
                    holdTargetlocId = brs[index].targetlocId
                }
            });
        }

        dispatch(generateBRCviaAlert({ brid: bbr, targetlocId: holdTargetlocId, monthPeriod: mp }));
        dispatch(getBRCByBRId(bbr));

        let mpTwo = `${marvsCurrentMonth.toString()}/01/${marvsCurrentYear}`;
        let buildReq = { host: bbr, monthPeriod: mpTwo };
  
        console.log("---generateBRC-checkLatestBRC-check::: ", buildReq);
        dispatch(checkLatestBRC(buildReq));
    }

    return (
        <Grow in>
            <div>
                <Button style={{ visibility: alertGenVisible, display: 'flex', marginBottom: '9px' }} fullWidth onClick={generateBRC} variant="text">
                    <Alert style={{ display: 'flex', marginBottom: '3px' }} severity="warning">         
                        {`GENERATE ${findCurrentMOS.code}`}
                    </Alert>
                </Button>            
            </div>
        </Grow>
    )
}