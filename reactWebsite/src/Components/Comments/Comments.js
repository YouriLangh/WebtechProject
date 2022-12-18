import React, { useState, useEffect } from 'react'
import "./Comments.css"
import { Button, Divider } from '@mui/material';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';

function Comments(props) {

    const [userInfo, setUserInfo] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(5);
    const [avgRating, setAvgRating] = useState(1);

    useEffect(() => {
        if(props){
        if(props.profile.username !== ''){
          const formattedData = {username: props.profile.username, comments: props.profile.comments}
        setUserInfo(formattedData)
        setComments(props.profile.comments)
        }}
      },[props])

    useEffect(() => {
      let totalRating = 0;
      for (const comment of comments) {
        totalRating += comment.rating;
      } 
      const averageRating = Math.round(totalRating / comments.length);
      if(!isNaN(averageRating)) 
      {setAvgRating(averageRating);
      console.log("average rating", averageRating)
      if(props.updateCallback) props.updateCallback(averageRating);
      }
    }, [comments])

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
        setComment('');
        setComments([...comments, {body: comment, rating: rating}]);
        document.getElementById("comment_input").value = '';
        setRating(5);
    }
    
  return (
    <div className="comments">
      <div className="average_rating">
        {props.showStars ? 
      <StarRatingComponent
              name="rate2" 
              editing={false}
              starCount={5}
              value={avgRating}/> : ""}</div>
        <Divider>Comments</Divider>
        {comments.length > 0 ? <ul id="comments_list">
            
            {comments.map((comment) => (
              <li key={comment.id}>
                <StarRatingComponent
              name="rate3" 
              editing={false}
              starCount={5}
              value={comment.rating}/><br/>
              {comment.body} </li>
            ))}
          </ul> : <p> No new comments</p>}
          
          {props.showStars ? "" : <div> 
          <Divider id="new_rating">Add comment</Divider>
          <div className='publish_comment'>
          <StarRatingComponent
          name="rate1" 
          starCount={5}
          value={rating}
          onStarClick={(nextValue) => {
            setRating(nextValue)
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
        </div>}
    </div>
  )
}

export default Comments