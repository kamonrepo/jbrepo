import React, { useEffect, useState } from 'react';
import { Paper, Typography, Divider, Button, Grow, CircularProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import useStyles from './styles';
import { getPost, getPostsBySearch } from '../../../actions/posts';
import { getSoaByPMSGID } from '../../../actions/soa';

const PostDetails = () => {

    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const { soa, isSOALoading } = useSelector((state) => state.soas);

    const [b64, setB64] = useState(null);

    const dispatch = useDispatch();
    const classes = useStyles();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getPost(id));
        dispatch(getSoaByPMSGID(id));
        console.log('[POSTDETAILS] component useEffect 1');

    },[id])

    useEffect(() => {
        if(post) {
            // search is none because we are not looking for search, we are only looking for tags, thats what were going to use to recommend the post
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
            console.log('[POSTDETAILS] component useEffect 2');
        }
    }, [post])

    //check the post and isLoading, before rendering on bottom return
    if(!post) return null;

    // if(isLoading) {
    //     return <Paper elevation={6} className={classes.loadingPaper}>
    //                 <CircularProgress size="7em" />
    //             </Paper>
    // }

    const jpegBinaryToBase64 = soa => {
        // Assuming imageData is the binary string you provided
        const blob = new Blob([new Uint8Array(soa)], { type: 'image/jpeg' });
        const reader = new FileReader();
        
        let imgSrc = null
        reader.onload = () => {

            const base64ImageData = reader.result.split(',')[1];
            console.log('reader.onload::: ', base64ImageData);
             imgSrc = `data:image/jpeg;base64,${base64ImageData}`;
           
            // Now you can use imgSrc as the src attribute in your <img> tag
        };

        reader.readAsDataURL(blob);

        console.log('imgSrc::: ', reader);
        return imgSrc;
    }

    const debugg =  () => {
        setB64(jpegBinaryToBase64(soa));
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
                        <Typography variant="body1"><Button onClick={debugg} variant='contained'>Send email notification</Button></Typography>

                        <Divider style={{ margin: '20px 0' }} />
                    </div>

                    {isSOALoading ? <CircularProgress /> : (
                        <div className={classes.imageSection}>
                            <img className={classes.media} alt={post.title}/>
                        </div>
                    )}
                </div>
            </Paper>
        </Grow>       
    )
}

export default PostDetails;