import React, { Component, createRef } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'
import 'react-tiny-fab/dist/styles.css';
import moment from 'moment';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const client = new W3CWebSocket('ws://127.0.0.1:8000?token=' + localStorage.getItem('posts-app-demo.token'))

class PostDetails extends Component {

    constructor(props) {
        super(props)


        this.newevent = {}

        this.state = {
          demodatabase: {
            details: "",
            comments: [ { "id" : "ttr", "commenter" : "user 1", "comment" : "Good" }, { "id" : "tts", "commenter" : "user 2", "comment" : "Good 2" }, { "id" : "ttt", "commenter" : "user 3", "comment" : "Good 3" } ]
          },
          isAdministrator: localStorage.getItem('posts-app-demo.administrator'),
          showEditor: false,
          post: ''
        }

        console.log('details constructed', this.state)

        this.editref = createRef()
        this.editcommentref = createRef()
        this.deleteref = createRef()

        const queryParams = new URLSearchParams(window.location.search);
        this.postid = queryParams.get('id');

    }

    shouldComponentUpdate (last, news) {
        return true
    }

    updateDetails () {
        console.log('get details')
        //demo
        this.setState({demodatabase: {details:"Details ...."}})
        return
        return fetch('http://localhost:8000/posts/details/myid', {
          method: 'GET'
        })
          .then(data => data.json())
          .then((res)=>{
              console.log('details', res)
              
              //this.setState({post: res})
            })
          .catch(err=>{
              alert('Error')
          })
    }

    componentDidMount () {
        console.log('did mount')
        this.updateDetails()
        client.onopen = () => {
            console.log("Websocket client connected")
          }
        client.onmessage = (m) => {
            console.log("onmessage", m)
            const message = JSON.parse(m.data)
            console.log("got reply! ", message)

            // for add & update only
            const event = message.message

            if (message.type === 'addevent') this.setState(prevState => ({
                posts: {
                    ...prevState.posts,
                    [event._id]: event 
                }
            }))
            else if (message.type === 'updateevent') this.setState(prevState => ({
                posts: {
                    ...prevState.posts,
                    [event._id]: event 
                }
            }))
            else if (message.type === 'deleteevent') {
                var posts = this.state.posts
                delete posts[message.message._id]
                this.setState({posts: posts})
            }
        }
        client.onclose = () => {
            alert("Error: websocket closed!")
        }
    }

    sendMessage = (type, message) => {
        console.log("Sending message")
        client.send(JSON.stringify({
          type: type,
          msg: message
        }))
      }

    onSubmit = (e) => {
        e.preventDefault()
        
        fetch('http://localhost:8000/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.newevent)
        })
          .then(data => {
              if (data.status === 201) {
                alert('Event added')
                this.formref.current.close()
              }
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    onSave = (e) => {
        e.preventDefault()
        
        fetch('http://localhost:8000/posts/' + this.state.post._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.editedpost)
        })
          .then(data => {
              console.log("data", data)
              if (data.status === 200) {
                alert('Event updated')
                this.editref.current.close()
                this.updateDetails()
              }
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    

    onSaveComment = (e) => {
      e.preventDefault()
      
      fetch('http://localhost:8000/comments/' + this.state.editedcomment._id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.editedcomment)
      })
        .then(data => {
            console.log("data", data)
            if (data.status === 200) {
              alert('Comment updated')
              this.editcommentref.current.close()
              //demo
              this.setState(pstate=>{
                const index = pstate.demodatabase.comments.findIndex(comment=>comment.id === this.state.editedcomment.id)
                pstate.demodatabase.comments[index] = this.state.editedcomment
                return {demodatabase: pstate.demodatabase}
              })
              console.log('newstate', this.state)
              //this.updateDetails()
            }
            else
              alert('Error: ' + data.statusText)
          })
        .catch(err=>{
            alert('Error')
        })
  }

    onDelete = (event) => {
        
        fetch('http://localhost:8000/posts/' + event._id, {
          method: 'DELETE'
        })
          .then(data => {
              console.log("data", data)
              if (data.status === 200) {
                alert('Event deleted')
                this.updateDetails()
              }
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    onDeleteSelectedComment = (event) => {
        
      fetch('http://localhost:8000/comments/' + this.state.editedcomment.id, {
        method: 'DELETE'
      })
        .then(data => {
            console.log("data", data)
            if (data.status === 200) {
              alert('comment deleted')
              //demo
              this.setState(pstate=>{
                console.log('find by id', this.state.editedcomment.id)
                const index = pstate.demodatabase.comments.findIndex(comment=>comment.id === this.state.editedcomment.id)
                pstate.demodatabase.comments.splice(index, 1)
                return ({demodatabase: pstate.demodatabase})
              })
              this.deleteref.current.close()
            }
            else
              alert('Error: ' + data.statusText)
          })
        .catch(err=>{
            alert('Error')
        })
  }

    formatDate (date) {
        console.log('format', date)
        if (date)
            return moment(date).format('D MMMM YYYY')
        else return ""
    }

    formatTime (time) {
        console.log('format time', time)
        if (time)
            return moment(time, 'HH:mm').format('h:mm a')
        else return ""
    }

    render() {
        console.log('post', this.state.post)
        return (
            <div className='mybox' style={{position:'relative', width:'90%'}}>
                {this.state.isAdministrator=='true'?<FaEdit className='clickable' style={{position:'absolute', color:'blue', right:'10px', top:'10px'}} onClick={()=>{
                  this.setState({editedpost: Object.assign({}, this.state.post)})
                  this.editref.current.open()
                  }} />:null}
                <h1>{this.state.post.title}</h1>
                <div>{this.state.demodatabase.details}</div>
                <h2 style={{marginTop:'20px'}}>Comments</h2>
                <div style={{}}>
                  {this.state.post?Object.keys(this.state.demodatabase.comments).map((key, i)=>{
                    return (
                      <div className='mybox' style={{position:'relative'}}>
                        {this.state.isAdministrator=='true'?<div><FaEdit className='clickable' style={{position:'absolute', color:'blue', right:'30px', top:'10px'}} onClick={()=>{
                  this.setState({editedcomment: Object.assign({}, this.state.demodatabase.comments[i])})
                  this.editcommentref.current.open()
                  }} /><FaTrashAlt className='clickable' style={{position:'absolute', color:'red', right:'10px', top:'10px'}} onClick={()=>{
                    this.state.editedcomment = this.state.demodatabase.comments[i]
                    this.deleteref.current.open()
                  }} /></div>:null}
                        <h5>{this.state.demodatabase.comments[i].commenter}</h5>
                        <div>{this.state.demodatabase.comments[i].comment}</div>
                      </div>
                    )
                  }):null}
                </div>
                <Popup ref={this.deleteref} className='flexCenter' modal nested>
                  <div style={{padding:'20px'}}>
                    <h2 style={{textAlign:'center'}}>Are you sure want to delete this comment?</h2>
                    <div style={{display:'flex', justifyContent:'center'}}>
                      <button className='mybutton' onClick={this.onDeleteSelectedComment}>Yes</button>
                      <button className='mybutton redbutton' onClick={()=>this.deleteref.current.close()}>No</button>
                    </div>
                  </div>
                </Popup>
                <Popup ref={this.editref} modal nested>
                      <div>
                          <form className='flexCenter' onSubmit={this.onSave} style={{padding:'20px'}}>
                              <h3 style={{margin: '10px'}}>Edit Post</h3>
                              <table style={{width:'100%'}}>
                                  <tbody>
                                      <tr>
                                          <td>Title</td>
                                          <td><input type="text" placeholder='Title' value={this.state.editedpost?this.state.editedpost.title:''} className='form-control' onChange={(e)=>{
                                              this.state.editedpost.title = e.target.value
                                              this.setState({editedpost: Object.assign({}, this.state.editedpost)})
                                            }} /></td>
                                      </tr>
                                      <tr>
                                          <td>Description</td>
                                          <td><input type="text" placeholder='Description...' value={this.state.editedpost?this.state.editedpost.detail:''} className='form-control' onChange={(e)=>{
                                              this.state.editedpost.detail = e.target.value
                                              this.setState({editedpost: Object.assign({}, this.state.editedpost)})
                                            }} /></td>
                                      </tr>
                                  </tbody>
                              </table>
                              <button type='submit' className='mybutton'>Save</button>
                          </form>
                          
                      </div>
                  </Popup>
                  <Popup ref={this.editcommentref} modal nested>
                      <div>
                          <form className='flexCenter' onSubmit={this.onSaveComment} style={{padding:'20px'}}>
                              <h3 style={{margin: '10px'}}>Edit Comment</h3>
                              <table style={{width:'100%'}}>
                                  <tbody>
                                      <tr>
                                          <td>Title</td>
                                          <td><input type="text" placeholder='Commenter' value={this.state.editedcomment?this.state.editedcomment.commenter:''} className='form-control' onChange={(e)=>{
                                              this.state.editedcomment.commenter = e.target.value
                                              this.setState({editedcomment: Object.assign({}, this.state.editedcomment)})
                                            }} /></td>
                                      </tr>
                                      <tr>
                                          <td>Description</td>
                                          <td><input type="text" placeholder='Comment' value={this.state.editedcomment?this.state.editedcomment.comment:''} className='form-control' onChange={(e)=>{
                                              this.state.editedcomment.comment = e.target.value
                                              this.setState({editedcomment: Object.assign({}, this.state.editedcomment)})
                                            }} /></td>
                                      </tr>
                                  </tbody>
                              </table>
                              <button type='submit' className='mybutton'>Save</button>
                          </form>
                          
                      </div>
                  </Popup>

            </div>
        );
    }
}

export default PostDetails;
