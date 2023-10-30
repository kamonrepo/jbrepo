import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';

export default function BRAlert( {isBRCLoading, brcData}) {

    useEffect(() => {
        let isCanceled = false;
    
        if(!isCanceled) {
            console.log('[COMPONENT-CHILD] MOUNT BRAlert useEffect');
          }
    
        return () => {
            console.log('[COMPONENT-CHILD] UNMOUNT!!! BRAlert useEffect');
          isCanceled = true;
        }              
    }, [brcData]);


    const generateBRC = () => {
        console.log('generateBRC---monthPeriodData::: ');
        console.log('generateBRC---handBRC ');
    
    }

    return (
        <div>
            <Button style={{ display: 'flex', marginBottom: '93px' }} fullWidth onClick={generateBRC} variant="contained">
                <Alert style={{ display: 'flex', marginTop: '33px', marginBottom: '3px' }} severity="warning">         
                    {/* {`Generate ${findCurrentMOS.code}`} */}
                    {'Generate.findCurrentMOS.code'}
                </Alert>
            </Button>            
        </div>
    )
}