import React, { useEffect } from 'react';
import { Paper, Typography, Divider, Button, Grow } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import useStyles from './styles';
import { getPost, getPostsBySearch } from '../../../actions/posts';

const PostDetails = () => {

    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const soa = useSelector((state) => state.soas);

    const dispatch = useDispatch();
    const classes = useStyles();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getPost(id));
        //dispatch(getSoaByBRCId(id));
        console.log('[POSTDETAILS] component useEffect 1 mount - done  dispatch(getPost(id)) ', id);
    },[id])

    useEffect(() => {
        if(post) {
            // search is none because we are not looking for search, we are only looking for tags, thats what were going to use to recommend the post
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
            console.log('[POSTDETAILS] component useEffect 2 mount - done  dispatch(getPostsBySearch(id)) ');
        }
    }, [post])

    //check the post and isLoading, before rendering on bottom return
    if(!post) return null;

    // if(isLoading) {
    //     return <Paper elevation={6} className={classes.loadingPaper}>
    //                 <CircularProgress size="7em" />
    //             </Paper>
    // }

    const sendNotif = async () => {
        console.log('woop::: ', soa[0].b64Jpeg);
    }

    return (
        <Grow in>
            <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
                <div className={classes.card}>
                    <div className={classes.section}>
                        <Typography>{post.title}</Typography>
                        <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                        <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                        <Divider style={{ margin: '20px 0' }} />
                        <Typography variant="body1"><Button onClick={sendNotif} variant='contained'>Send email notification</Button></Typography>

                        <Divider style={{ margin: '20px 0' }} />
                    </div>

                    <div className={classes.imageSection}>
                        <img className={classes.media} alt={post.title} src={soa && soa[0].b64Jpeg}/>
                    </div>

                </div>
            </Paper>
        </Grow>
    )
}

export default PostDetails;