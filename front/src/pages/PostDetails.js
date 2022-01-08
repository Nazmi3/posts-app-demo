import React, { createRef, useState, useEffect } from 'react';
import Popup from 'reactjs-popup';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

import 'reactjs-popup/dist/index.css'
import 'react-tiny-fab/dist/styles.css';

const Postdetails = () => {

  const [isAdministrator, setisAdministrator] = useState(localStorage.getItem('posts-app-demo.administrator'));
  const [demodatabase, setdemodatabase] = useState({
    post: {},
    details: "",
    comments: []
  });

  const [commenttodelete, setcommenttodelete] = useState({});
  const [editedpost, seteditedpost] = useState({});
  const [editedcomment, seteditedcomment] = useState({});
  const [newcomment, setnewcomment] = useState({});

  const posteditref = createRef()
  const addcommentref = createRef()
  const editcommentref = createRef()
  const deleteref = createRef()

  const myfetch = async (url, method, object) => {
    return await fetch(url, {
      method: method,
      headers: {
        'Authorization': 'Bearer demotoken',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(object)
    })
  }

  const onAddComment = async (e) => {
    e.preventDefault()
    // run in demo only
    alert('Comment added')
    addcommentref.current.close()
    // update by state instead of http or websocket events
    setdemodatabase({...demodatabase, comments: [...demodatabase.comments, newcomment]})
    // not run in non-demo only
    return
    // post id hardcoded for demo only, should get from database post id
    let postid = "61ce3346ada85c25e7c3ca5f"
    let response = await myfetch('http://localhost:8000/comments/' + postid, 'POST', newcomment)
    if (response.status === 201) {
      alert('Comment added')
      addcommentref.current.close()
      // update by http instead of websocket
      updateDetails()
    } else alert('Error: ' + response.statusText)
  }

  const onDeleteSelectedComment = async (event) => {
        
    // only in demo
    alert('comment deleted')
    //update by state
    setdemodatabase({...demodatabase, comments: demodatabase.comments.filter((comment)=>comment.id !== commenttodelete.id)})
    deleteref.current.close()

    // only in non-demo
    return
    let response = await myfetch('http://localhost:8000/comments/' + commenttodelete.id, 'DELETE', {})
    if (response.status === 200) {
      alert('comment deleted')
      setdemodatabase({...demodatabase, comments: demodatabase.comments.filter((comment)=>comment.id !== commenttodelete.id)})
      deleteref.current.close()
    }
    else
      alert('Error: ' + response.statusText)
  }

  const onSave = async (e) => {
    e.preventDefault()

    //demo
    alert('Post updated')
    posteditref.current.close()

    console.log('new state', demodatabase)
    setdemodatabase({...demodatabase, post: editedpost})
    
    // save to database
    return
    let response = await myfetch('http://localhost:8000/posts/' + demodatabase.post._id, 'PUT', editedpost)
    console.log("response", response)
    if (response.status === 200) {
      alert('Post updated')
      posteditref.current.close()
      this.updateDetails()
    }
    else
      alert('Error: ' + response.statusText)
  }

  const onSaveComment = async (e) => {
    e.preventDefault()

    // only in demo
    alert('Comment updated')
    editcommentref.current.close()
    setdemodatabase({...demodatabase, comments: demodatabase.comments.map((comment)=>comment.id === editedcomment.id?editedcomment:comment)})
    
    // only in non-demo
    return
    let response = await myfetch('http://localhost:8000/comments/' + editedcomment._id, 'PUT', editedcomment)
    console.log("response", response)
    if (response.status === 200) {
      alert('Comment updated')
      editcommentref.current.close()
      setdemodatabase({...demodatabase, comments: demodatabase.comments.map((comment)=>comment.id === editedcomment.id?editedcomment:comment)})
      updateDetails()
    }
    else
      alert('Error: ' + response.statusText)
  }

  const updateDetails = async () => {
    // for demo
    setdemodatabase({
        post: {"_id":"61ce3346ada85c25e7c3ca5f", "title":"Title 1", "details":"Details 1"},
        details: "",
        comments: [ 
          { "id" : "ttr", "commenter" : "user 1", "comment" : "Good" }, 
          { "id" : "tts", "commenter" : "user 2", "comment" : "Good 2" }, 
          { "id" : "ttt", "commenter" : "user 3", "comment" : "Good 3" } 
        ]
    })
    //for non-demo
    return
    let response = await myfetch('http://localhost:8000/posts/details/postid', 'GET', {})
    if (response.status === 200) setdemodatabase(response.json())
    else alert('Error:' + response.status)
  }

  // update post details once component mounted only
  useEffect(() => {
      updateDetails()
  }, []);

  return (
    <div className='mybox' style={{position:'relative', width:'90%'}}>
        {isAdministrator=='true'?<FaEdit className='clickable' style={{position:'absolute', color:'blue', right:'10px', top:'10px'}} onClick={()=>{
          seteditedpost(Object.assign({}, demodatabase.post))
          posteditref.current.open()
          }} />:null}
        <h1>{demodatabase.post.title}</h1>
        <div>{demodatabase.post.details}</div>
        <h2 style={{marginTop:'20px'}}>Comments</h2>
        <div className='mybox'>
          <button className='mybutton' onClick={()=>{
            setnewcomment({})
            addcommentref.current.open()
            }}>Add Comment</button>
          <div style={{}}>
            {demodatabase.post?Object.keys(demodatabase.comments).map((key, i)=>{
              console.log('map', demodatabase.comments[key])
              return (
                <div className='mybox' style={{position:'relative'}}>
                  {isAdministrator=='true'?<div><FaEdit className='clickable' style={{position:'absolute', color:'blue', right:'30px', top:'10px'}} onClick={()=>{
            seteditedcomment(demodatabase.comments[i])
            editcommentref.current.open()
            }} /><FaTrashAlt className='clickable' style={{position:'absolute', color:'red', right:'10px', top:'10px'}} onClick={()=>{
              setcommenttodelete(demodatabase.comments[i])
              deleteref.current.open()
            }} /></div>:null}
                  <h5>{demodatabase.comments[i].commenter}</h5>
                  <div>{demodatabase.comments[i].comment}</div>
                </div>
              )
            }):null}
          </div>
        </div>
        <Popup ref={deleteref} className='flexCenter' modal nested>
          <div style={{padding:'20px'}}>
            <h2 style={{textAlign:'center'}}>Are you sure want to delete this comment?</h2>
            <div style={{display:'flex', justifyContent:'center'}}>
              <button className='mybutton' onClick={onDeleteSelectedComment}>Yes</button>
              <button className='mybutton redbutton' onClick={()=>deleteref.current.close()}>No</button>
            </div>
          </div>
        </Popup>
        <Popup ref={posteditref} modal nested>
              <div>
                  <form className='flexCenter' onSubmit={onSave} style={{padding:'20px'}}>
                      <h3 style={{margin: '10px'}}>Edit Post</h3>
                      <table style={{width:'100%'}}>
                          <tbody>
                              <tr>
                                  <td>Title</td>
                                  <td><input type="text" placeholder='Title' value={editedpost?editedpost.title:''} className='form-control' onChange={(e)=>{
                                      editedpost.title = e.target.value
                                      seteditedpost(Object.assign({}, editedpost))
                                    }} /></td>
                              </tr>
                              <tr>
                                  <td>Description</td>
                                  <td><input type="text" placeholder='Description...' value={editedpost?editedpost.details:''} className='form-control' onChange={(e)=>{
                                      seteditedpost({...editedpost, details: e.target.value})
                                    }} /></td>
                              </tr>
                          </tbody>
                      </table>
                      <button type='submit' className='mybutton'>Save</button>
                  </form>
                  
              </div>
          </Popup>
          <Popup ref={editcommentref} modal nested>
              <div>
                  <form className='flexCenter' onSubmit={onSaveComment} style={{padding:'20px'}}>
                      <h3 style={{margin: '20px'}}>Edit Comment</h3>
                      <table style={{width:'100%'}}>
                          <tbody>
                              <tr>
                                  <td>Name</td>
                                  <td><input type="text" placeholder='Commenter' value={editedcomment?editedcomment.commenter:''} className='form-control' onChange={(e)=>{
                                      seteditedcomment({...editedcomment, commenter: e.target.value})
                                    }} /></td>
                              </tr>
                              <tr>
                                  <td>Comment</td>
                                  <td><input type="text" placeholder='Comment' value={editedcomment?editedcomment.comment:''} className='form-control' onChange={(e)=>{
                                      seteditedcomment({...editedcomment, comment: e.target.value})
                                    }} /></td>
                              </tr>
                          </tbody>
                      </table>
                      <button type='submit' className='mybutton'>Save</button>
                  </form>
                  
              </div>
          </Popup>
          
          <Popup ref={addcommentref} modal nested>
              <div>
                  <form className='flexCenter' onSubmit={onAddComment} style={{padding:'20px'}}>
                      <h3 style={{margin: '20px'}}>Add Comment</h3>
                      <table style={{width:'100%'}}>
                          <tbody>
                              <tr>
                                  <td>Name</td>
                                  <td><input type="text" placeholder='Your name' value={newcomment?newcomment.commenter:''} className='form-control' onChange={(e)=>{
                                      setnewcomment({...newcomment, commenter: e.target.value})
                                    }} /></td>
                              </tr>
                              <tr>
                                  <td>Comment</td>
                                  <td><input type="text" placeholder='Your comment...' value={newcomment?newcomment.comment:''} className='form-control' onChange={(e)=>{
                                      setnewcomment({...newcomment, comment: e.target.value})
                                    }} /></td>
                              </tr>
                          </tbody>
                      </table>
                      <button type='submit' className='mybutton'>Add</button>
                  </form>
                  
              </div>
          </Popup>

    </div>
  );
}

export default Postdetails;
