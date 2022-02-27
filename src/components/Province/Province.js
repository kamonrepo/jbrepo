import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import MainLocation from '../MainLocation/MainLocation';

const Province = ({ param }) => {

  // console.log('component-province: ', param);

  const [province, setProvinces] = useState({})

    useEffect(() => {
      // console.log('component-province-useEffect: ', param);
    }, [param])

    const handleChange = data => {
      // console.log('component-province-handleChange: ', provinces);
            setProvinces(data);
    }

    return (
      <>
      <Select fullWidth value={province} onChange={e => handleChange(e.target.value)}>
        {
          Object.keys(param).map(obj => (
            <MenuItem key={param[obj]._id} value={param[obj].province}>{param[obj].province}</MenuItem>
          ))
        }
        </Select>

        { province?.length !== 0 ? <MainLocation param={province}/> : null }

      </>
    );
}

export default Province;