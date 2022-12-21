import React, { useState, useEffect } from 'react'
import "./Comments.css"
import { Button, CardContent, Divider } from '@mui/material';
import axios from 'axios';
import StarRatingComponent from 'react-star-rating-component';
import Card from '@mui/material/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const jwt = require('jsonwebtoken')

function Comments(props) {

    const [userInfo, setUserInfo] = useState({});
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(5);
    const [avgRating, setAvgRating] = useState(1);
    const [editComment, setEditComment] = useState(false);
    const [edittedComment, setEdittedComment] = useState('');
    const [edittedRating, setEdittedRating] = useState(false);

    useEffect(() => {
        if(props){
        if(props.profile.username !== ''){
          const formattedData = {username: props.profile.username, comments: props.profile.comments}
        setUserInfo(formattedData)
        setComments(props.profile.comments)
        setAvgRating(props.profile.rating)
        }}
      },[])

    useEffect(() => {
      if(props.showStars) {
        setComments(props.profile.comments)
      } 
    }, [props])

    useEffect(() => {
      if (comments.length != 0) {
        let totalRating = 0;
        for (const comment of comments) {
          totalRating += comment.rating;
        } 
        const averageRating = Math.round((totalRating + 5) / (comments.length + 1))
        console.log(averageRating)
        if(!isNaN(averageRating)) 
        {setAvgRating(averageRating);
        }}
      else {
        setAvgRating(5);
      }
    }, [comments])

    useEffect(() => {
      if(props && props.updateCallback){
        props.updateCallback(avgRating, comments)
      }
      try {
        axios({
          url: 'http://localhost:4000/app/profile/edit',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            username: userInfo.username,
            rating: avgRating
          }),
        }).then(res => {
          console.log(res)
        })
      } catch (error) {console.log(error)}
    }, [avgRating])

    const addComment = async (e) => {
      const username = userInfo.username;
      const userToken = localStorage.getItem('token');
      const user = jwt.decode(userToken)
      const posterUsername = user.username;
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
              posterUsername
            }),
          }).then(res => {
            console.log(res)
            setComment('');
            setComments([...comments, res.data]);
            document.getElementById("comment_input").value = '';
            setRating(5);
          })
        } catch (error) {console.log(error)}
        
    }

    function isYourComment(comment) {
      const userToken = localStorage.getItem('token');
      const username = jwt.decode(userToken).username;
      return(comment.user == username);
    }

    function renderCommentUser(comment) {
      if (comment.user !== undefined) {
        let poster = isYourComment(comment) ? "You" : comment.user
        return (
          <div className='comment_user'>
            {poster}:
          </div>
        );}}

    function handleEditComment(id, old_comment, old_rating) {
      setEditComment(id);
      setEdittedComment(old_comment);
      setEdittedRating(old_rating);
    }

    function handleDeleteComment(id) {
      try {
        axios({
          url: 'http://localhost:4000/app/profile/comment/delete',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            username: userInfo.username,
            id: id,
          }),
        }).then(res => {
          console.log(res)
          setComments(res.data.comments);
        })
      } catch (error) {console.log(error)}
    }

    function handleSaveComment(id) {
      setEditComment(false);
      setEdittedRating(false);
      setEdittedComment('');
      try {
        axios({
          url: 'http://localhost:4000/app/profile/comment/edit',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            username: userInfo.username,
            id: id,
            comment: edittedComment,
            rating: edittedRating
          }),
        }).then(res => {
          console.log(res)
          setComments(res.data.comments);
        })
      } catch (error) {console.log(error)}
    }

  return (
    <div className="comments">
      <div className="average_rating">
        {props.showStars ? 
      <StarRatingComponent
              name="rate2" 
              editing={false}
              starCount={5}
              value={avgRating}/> : ""}
              </div>
        <Divider>Comments</Divider>
        {comments.length > 0 ? <ul id="comments_list">
            
            {comments.map((comment) => (
              <li key={comment.id}>
                <StarRatingComponent
              name="rate3" 
              editing={(editComment == comment._id) ? true : false}
              starCount={5}
              value={edittedRating ? edittedRating : comment.rating}
              onStarClick={(nextValue) => {
                setEdittedRating(nextValue)
              }}/><br/>
              {renderCommentUser(comment)}
              <Card>
                <CardContent className="comment_card">
              {isYourComment(comment) ? (
                <div>
                  {(editComment == comment._id) ? (
                    <div>
                      <textarea 
                      value={edittedComment} 
                      onChange={(event) => setEdittedComment(event.target.value)} />
                      <div className='edit_comments'>
                      <Button onClick={() => handleSaveComment(comment._id)}>Save</Button>
                      </div>
                    </div>
                  ) : (
                  <div>
                  {comment.body}
                  <div className='edit_comments'>
                  <Button onClick={() => handleDeleteComment(comment._id)}><FontAwesomeIcon icon={faTrash} /></Button>
                  <Button onClick={() => handleEditComment(comment._id, comment.body, comment.rating)}>Edit</Button>
                  </div></div>)}</div>
                ) : (
                  <div>{comment.body}</div>
                )}</CardContent></Card></li>
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
