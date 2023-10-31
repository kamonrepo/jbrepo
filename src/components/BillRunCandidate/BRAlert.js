import React, { useState, useEffect } from 'react';
import { Button, Grow } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';

export default function BRAlert( { isBRCLoading, brcData}) {

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
                <Button style={{ visibility: alertGenVisible, display: 'flex', marginBottom: '9px' }} fullWidth onClick={generateBRC} variant="contained">
                    <Alert style={{ display: 'flex', marginTop: '33px', marginBottom: '3px' }} severity="warning">         
                        {/* {`Generate ${findCurrentMOS.code}`} */}
                        {'Generate.findCurrentMOS.code'}
                    </Alert>
                </Button>            
            </div>
        </Grow>
    )
}