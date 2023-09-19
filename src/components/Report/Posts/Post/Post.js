import React, { useState } from 'react';
import { Card, CardActions, CardContent, Button, Typography, ButtonBase } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import {  deletePost } from '../../../../actions/posts';
import { getSoaByBRCId } from '../../../../actions/soa';
import useStyles from './styles';
import { useHistory } from 'react-router-dom';

const Post = ({ post, setCurrentId }) => {

  //THIS SELECTOR WILL FIND THE UPDATED POST AND RE-RENDER THE UPDATED DATA..
  //const updatedPost = useSelector((state) => (state.posts.find((post) => post._id === post._id)));
  console.log('[POST]');
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));
  const history = useHistory();

  const userId = user?.result.googleId || user?.result?._id;

  const openPost = () => history.push(`/posts/${post._id}`);

  return (
    <Card className={classes.card} raised elevation={6}>

      <ButtonBase
       component="span"
       className={classes.cardAction} 
       onClick={openPost}
      >
          <div>
            <Typography className={classes.title} variant="h6">{post.owner}</Typography>
            <Typography className={classes.title} variant="body2">{moment(post.createdAt).fromNow()}</Typography>
          </div>
          {(user?.result?.googleId === post?.creator || user?.result?._id === post?.creator) && (
          <div>
            <Button onClick={() => setCurrentId(post._id)} style={{ color: 'white' }} size="small">
              <MoreHorizIcon fontSize="default" />
            </Button>
          </div>
          )}
          <div className={classes.details}>
            <Typography variant="body2" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
          </div>
          <Typography className={classes.title} gutterBottom variant="h5" component="h2">{post.title}</Typography>
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
          </CardContent>

      </ButtonBase>
      
      <CardActions className={classes.cardActions}>
        {(user?.result?._id !== undefined && user?.result?._id === post?.creator) && (
        <Button size="small" color="secondary" onClick={() => dispatch(deletePost(post._id))}>
          <DeleteIcon fontSize="small" /> Delete
        </Button>
        )}
      </CardActions>
      
    </Card>
  );
};

export default Post;
