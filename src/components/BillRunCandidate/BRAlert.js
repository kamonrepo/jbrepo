import React, { useState, useEffect } from 'react';
import { Button, Grow } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { generateBRCviaAlert } from '../../actions/billruncandidate';
export default function BRAlert({ findCurrentMOS, isBRCLoading, brcData }) {

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
    
    const generateBRC = () => {
        console.log('generateBRC');
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