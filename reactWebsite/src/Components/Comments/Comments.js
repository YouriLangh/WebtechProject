import React, { useState, useEffect } from 'react'
import { renderToString } from 'react-dom/server';
import "./Comments.css"
import { Button, Divider } from '@mui/material';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

const jwt = require('jsonwebtoken')

function Comments(props) {

    const [userInfo, setUserInfo] = useState({});
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [rating, setRating] = useState(1);

    useEffect(() => {
        if(props){
        if(props.profile.username !== ''){
          console.log("adding comments")
          const formattedData = {username: props.profile.username, comments: props.profile.comments}
        setUserInfo(formattedData)
        setComments(props.profile.comments)
        }}
      },[props])

    const addComment = async (e) => {
        const username = userInfo.username;
        try {
          axios({
            url: 'http://localhost:4000/app/profile/comment',
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              username,
              comment,
              rating,
            }),
          }).then(res => {
            console.log(res)
          })
        } catch (error) {console.log(error)}
        const stars = renderToString(<StarRatingComponent
            name="rate2" 
            editing={false}
            starCount={5}
            value={rating}/>)
        console.log(stars)
        document.getElementById("comments_list").innerHTML += ('<li>'+stars+'<br/>'+comment+'</li>');
        setComment('');
        document.getElementById("comment_input").value = '';
        setRating(1);
    }

    useEffect(() => {
        const username = userInfo.username;
        try{ 
        axios({
          url: 'http://localhost:4000/app/profile',
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          data: JSON.stringify({
              username,
          }),
          }).then(res => {
            let newProfile = jwt.decode(res.data.profile);
            setComments(newProfile.comments);
            console.log(newProfile.comments(1).rating);})
        } catch (error) {console.log(error)}
    }, []);

    

  return (
    <div className="comments">
        <Divider>Comments</Divider>
          <ul id="comments_list">
            {comments.map((comment) => (
              <li key={comment.body}><StarRatingComponent
              name="rate2" 
              editing={false}
              starCount={5}
              value={comment.rating}/><br/>
              {comment.body} </li>
            ))}
          </ul>
          <StarRatingComponent
          id="new_rating"
          name="rate1" 
          starCount={5}
          value={rating}
          onStarClick={(nextValue) => {
            setRating(nextValue)
            console.log(nextValue)
        }}
        /> 
        <textarea
          id="comment_input"
          rows='5'
          cols='50'
          placeholder='Type your comment here'
          onChange={e => setComment(e.target.value)}
        />
        <br/>
        <Button variant="outlined" onClick={addComment} id="add_comment_button">
          Add comment
        </Button>
    </div>
  )
}

export default Comments