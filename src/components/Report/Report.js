
import React, { useEffect, useState } from 'react';
import { Container, Grow, Grid , Paper, AppBar, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import Posts from '../Report/Posts/Posts';
import Pagination from '../Report/Pagination';
import { useHistory, useLocation } from 'react-router-dom';
import useStyles from './styles';
import { getPostsBySearch } from '../../actions/posts';
import { getSoas } from '../../actions/soa';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Report = () => {
  const classes = useStyles();
  const [currentId, setCurrentId] = useState(0);
  const dispatch = useDispatch();
  const query = useQuery();
  const history = useHistory();
  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  useEffect(() => {
    dispatch(getSoas());
    console.log('[REPORT] dispatch getSoas DONE');
  }, [])

  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);

    const searchPost = () => {
      console.log('[REPORT] searchPost');
      if(search.trim() || tags) {

        dispatch(getPostsBySearch({search, tags:  tags.join(',')  }));
        console.log('dispatch getPostsBySearch DONE');

        history.push(`/posts/search?searchQuery=${search || 'none'} &tags=${tags.join(',')}`);
      } else {
        history.push('/')
      }
    }

    const handleKeyPress = (e) => {
      if(e.keyCode === 13) {
        searchPost();
      }
    }

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justifyContent = "space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9} >
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
          <AppBar className={classes.appBarSearch} position="static" color="inherit"> 
            <TextField 
              name="search" 
              variant="outlined" 
              label="Search here" 
              fullWidth
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              onKeyPress={handleKeyPress}
            />
            <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
          </AppBar>
            {(!searchQuery && !tags.length) && (
            <Paper elevation={6} className={classes.pagination}>
              <Pagination page={page} />
            </Paper>
            )}

          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Report;
