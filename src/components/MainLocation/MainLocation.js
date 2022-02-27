import React,{ useEffect, useState } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { useSelector } from 'react-redux';

const MainLocation = ({ param }) => {

    const locations = useSelector(state => state.locations);
    const [mainLocation, setMainLocation] = useState('');

    const handleChange = mainLoc => {

        setMainLocation(prev => mainLoc);

    }



    
    useEffect(() => {
      let mainLocFilter = locations.filter(i => i.province === param);
      setMainLocation(mainLocFilter);
      console.log('component-mainLocation-useEffect-mainLocFilter: ', mainLocFilter);

      }, [param])

    return (
      <>
      <Select fullWidth value={mainLocation} onChange={e => handleChange(e.target.value)}>
        {
          Object.keys(mainLocation).map(i => ( 
          <MenuItem key={mainLocation[i]._id} value={mainLocation[i].mainLocation}> { mainLocation[i].mainLocation } </MenuItem>
          ))
        }
        </Select>

      </>
    );
}

export default MainLocation