import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

export default function Tags( { groups, setGrpIds, setGrpNames } ) {

  const onTagsChange = (event, values) => {
  
    let newArrState = [];
    let grpNames = []

    Object.keys(values).forEach(keys => {
      newArrState.push(values[keys]._id);
      grpNames.push(values[keys].name);
    })
    
    setGrpNames(grpNames);
    setGrpIds(newArrState);
  }

  return (
    <Stack spacing={3} sx={{ width: 600 }}>
      <Autocomplete
        style={{ backgroundColor: 'whitesmoke'}}
        multiple
        id="tags-standard"
        options={groups}
        getOptionLabel={(option) => option.name}
        // defaultValue="all" //pwede dito nka ALL default, close nlng nila ung ALL kung gusto ng BY GROUP
        onChange={onTagsChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="  ...Add Group"
        
          />
        )}
      />
    </Stack>
  );
}
