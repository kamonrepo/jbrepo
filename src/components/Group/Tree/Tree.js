import React, { useEffect, useState } from 'react';
import { CircularProgress, Link, Divider, Grow, Container, Grid } from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../../actions/group';
import useStyles from './styles';

const Tree = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);

    const groups = useSelector(state => state.groups);

    const [staticChildren, setStaticChildren] = useState([]);
    const [dataCollection, setDataCollection] = useState({ selectedMember: '', currentId: '', firstname: '', lastname: '', typeCollection: ''});

    useEffect(() => {
    },[])

    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };
    
    const handleSelect = (event, nodeIds) => {
      setSelected(nodeIds);
    };

    const popuplateChildrens = childrenId => {
      return Object.keys(groups).map(keyName => 
        <TreeItem nodeId={keyName} label={groups[keyName]._id === childrenId 
              ?  <Link component="button" variant="body2" onClick={() => {
                    setDataCollection({...dataCollection, 
                      currentId: groups[keyName]._id,
                      firstname: groups[keyName].firstname,
                      lastname: groups[keyName].lastname,
                      typeCollection: 'childrens',
                      selectedMember: 'childrens'
                    })
                }}>

                  {`${groups[keyName].firstname } ${groups[keyName].lastname } ` }
                </Link>
          : null } /> );
    }

    return (
        <>
        <Grow in>  
            <Container>
              <Grid className={classes.container} container>
                <Grid className={classes.customMargin} item xs={12} sm={12} md={12} lg={6} elevation={12} >
                      <TreeView
                          className={classes.root}
                          defaultCollapseIcon={<ExpandMoreIcon />}
                          defaultExpandIcon={<ChevronRightIcon />}
                          expanded={expanded}
                          selected={selected}
                          onNodeToggle={handleToggle}
                          onNodeSelect={handleSelect}
                        >
                          {!groups?.length ? <CircularProgress /> : (
                                <>
                                    {groups.map((fam) => (
                                    <TreeItem key={fam._id} nodeId={fam._id} label={fam.name}>
                                            <Link component="button" variant="body2" 
                                              onClick={() => {
                                                 setDataCollection({...dataCollection, 
                                                  currentId: fam._id,
                                                  firstname: fam.name,
                                                  lastname: fam.name,
                                                  typeCollection: 'families',
                                                  selectedMember: 'father'
                                                })

                                                setStaticChildren({...staticChildren, children: fam.children } )
                                              }}>

                                              {` ${fam.name} ${fam.name}` }
                                            </Link>
                                            {` ${fam.name} ${fam.name}` }
                                            <Divider/>

                                    </TreeItem>
                                    ))}         
                                </>
                          )}
                        </TreeView>
                </Grid> 

              </Grid> 
            </Container>
        </Grow>
      </>
    )
}

export default Tree;