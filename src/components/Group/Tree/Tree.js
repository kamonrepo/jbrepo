import React, { useEffect, useState } from 'react';
import { CircularProgress, Grow, Paper } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PlaceIcon from '@mui/icons-material/Place';
import TreeItem from '@material-ui/lab/TreeItem';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups, getSublocs, getTargetlocs } from '../../../actions/group';
import useStyles from './styles';

const Tree = ({ isFormSubmitted }) => {
    console.log('Tree init ', isFormSubmitted);

    const dispatch = useDispatch();
    const classes = useStyles();
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);

    const cities = useSelector(state => state.groups);
    const municipalities = useSelector(state => state.sublocations);
    const locations = useSelector(state => state.targetlocations);

    useEffect(() => {
      if(isFormSubmitted.flag === true && isFormSubmitted.opt == 'getGroups') {
        dispatch(getGroups());
        console.log('Tree useEffect dispatch - getGroups');
      }
      if(isFormSubmitted.flag === true && isFormSubmitted.opt == 'getSublocs') {
        dispatch(getSublocs());
        console.log('Tree useEffect dispatch - getSublocs');
      }
      if(isFormSubmitted.flag === true && isFormSubmitted.opt == 'getTargetlocs') {
        dispatch(getTargetlocs());
        console.log('Tree useEffect dispatch - getTargetlocs');
      }

    }, [isFormSubmitted]); 

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };
    
    const handleSelect = (event, nodeIds) => {
      setSelected(nodeIds);
    };
    
    return (
      <Paper elevation={9} style={{ marginTop: '33px', backgroundColor: '#dce8e0', display: 'flex', flexDirection: 'row'}}>
        <Grow in>  
          <div>
            <TreeView
                  className={classes.root}
                  defaultCollapseIcon={<ExpandMoreIcon />}
                  defaultExpandIcon={<ChevronRightIcon />}
                  expanded={expanded}
                  selected={selected}
                  onNodeToggle={handleToggle}
                  onNodeSelect={handleSelect}
            >
                      {!cities?.length ? <CircularProgress /> : (
                            <>{cities.map((city) => (
                                <TreeItem key={city._id} nodeId={city._id} label={<span style={{ fontWeight: 'bold'}}>{city.name}</span>}>
                                  {municipalities.map((mun) => mun.groupId == city._id && (
                                      <TreeItem key={mun._id} nodeId={mun._id} label={mun.name}>
                                       {
                                          locations.map((loc) => mun._id == loc.sublocId && (
                                            <div key={loc._id + 'divUnique' } style={{ display: 'flex'}} >                                          
                                              <PlaceIcon key={loc._id + 'iconUnique'} />
                                              <TreeItem key={loc._id} nodeId={loc._id} label={loc.name}>
                                              </TreeItem>
                                            </div>
                                          ))
                                        }
                                      </TreeItem>
                                  ))}
                                </TreeItem>

                            ))}</>       
                      )}
              </TreeView>
          </div> 
        </Grow>
      </Paper>
    )
}

export default Tree;