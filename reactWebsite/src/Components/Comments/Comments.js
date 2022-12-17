import React, { useState, useEffect } from 'react'
import "./Comments.css"
import { Button, Divider } from '@mui/material';
import axios from 'axios';

const jwt = require('jsonwebtoken')

function Comments(props) {
    
    const [userInfo, setUserInfo] = useState({});
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])

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
            }),
          }).then(res => {
            console.log(res)
          })
        } catch (error) {console.log(error)}
        document.getElementById("comments_list").innerHTML += ('<li>'+comment+'</li>');
        setComment('')
        document.getElementById("comment_input").value = '';
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
            console.log(newProfile.comments);})
        } catch (error) {console.log(error)}
    }, []);

    

  return (
    <div className="comments">
        <Divider>Comments</Divider>
          <ul id="comments_list">
            {comments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))}
          </ul>
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