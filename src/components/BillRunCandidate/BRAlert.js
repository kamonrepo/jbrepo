import React, { useState, useEffect } from 'react';
import { Button, Grow } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { generateBRCviaAlert, getBRCByBRId } from '../../actions/billruncandidate';

export default function BRAlert({ bbr, marvs12MOS, findCurrentMOS, selectedMonthPeriodMOS, selectedMonthPeriodYEAR, brcData }) {

    const dispatch = useDispatch();
    const [alertGenVisible, setAlertGenVisible] = useState('visible');

    useEffect(() => {

        let isCanceled = false;
    
        if(!isCanceled) {
            console.log('[COMPONENT-CHILD] MOUNT BRAlert useEffect');

            if(brcData.length !== 0) {
                setAlertGenVisible('hidden');
            }
        }
    
        return () => {

            console.log('[COMPONENT-CHILD] UNMOUNT!!! BRAlert useEffect');
            isCanceled = true;
        }      
                
    }, [brcData]);
    
    const generateBRC = async () => {

        let findMOSID = marvs12MOS.find((mos) => mos.code === selectedMonthPeriodMOS);
        let mp = `${findMOSID.id}/01/${selectedMonthPeriodYEAR}`;

        await dispatch(generateBRCviaAlert({ host: bbr, monthPeriod: mp }));
        await dispatch(getBRCByBRId(bbr));
    }

    console.log('[BRAlert] brcData.length: ', brcData.length);

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