import React, { useEffect, useRef, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'
import 'react-tiny-fab/dist/styles.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const client = new W3CWebSocket('ws://127.0.0.1:8000?token=' + localStorage.getItem('posts-app-demo.token'))

const Posts = () => {
    let navigate = useNavigate()
    let newpost = {}
    const formref = useRef(null)
    const editref = useRef(null)
    const [posts, setposts] = useState({});
    const [selectedpost, setselectedpost] = useState({});
    console.log('called function post')

    //initialize
    useEffect(() => {
        updateposts()
        initialize()
    }, []);

    function updateposts () {
        return fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'GET'
        })
          .then(data => data.json())
          .then((res)=>{
              var postsObject = {}
              for (const post of res) {
                  postsObject[post._id] = post
              }
              setposts(postsObject)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    function initialize () {
        client.onopen = () => {
            console.log("Websocket client connected")
          }
        client.onmessage = (m) => {
            console.log("onmessage", m)
            const message = JSON.parse(m.data)
            console.log("got reply! ", message)

            // for add & update only
            const post = message.message

            if (message.type === 'addpost') setposts({
                ...posts,
                [post._id]: post 
            }) 
            else if (message.type === 'updatepost') setposts({
                ...posts,
                [post._id]: post 
            })
            else if (message.type === 'deletepost') {
                var posts = posts
                delete posts[message.message._id]
                setposts(posts)
            }
        }
        client.onclose = () => {
            alert("Error: websocket closed!")
        }
    }

    function sendMessage (type, message) {
        console.log("Sending message")
        client.send(JSON.stringify({
          type: type,
          msg: message
        }))
      }

    function onSubmit (e) {
        console.log('onsubmit')
        e.preventDefault()
        console.log('onsubmit 3', newpost)
        
        fetch('http://localhost:8000/posts', {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Bearer demotoken', 
            'Content-Type': 'application/json'
        }),
          body: JSON.stringify(newpost)
        })
          .then(data => {
              console.log('data', data)
              if (data.status === 201) {
                alert('post added')
                formref.current.close()
              }
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    function onUpdate (e) {
        e.preventDefault()
        
        fetch('http://localhost:8000/posts/' + selectedpost._id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedpost)
        })
          .then(data => {
              console.log("data", data)
              if (data.status === 200) {
                alert('post updated')
                
              }
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    function onDelete (post) {
        
        fetch('http://localhost:8000/posts/' + post._id, {
          method: 'DELETE'
        })
          .then(data => {
              console.log("data", data)
              if (data.status === 200) {
                alert('post deleted')
              }
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
    }

    function formatDate (date) {
        console.log('format', date)
        if (date)
            return moment(date).format('D MMMM YYYY')
        else return ""
    }

    function formatTime (time) {
        console.log('format time', time)
        if (time)
            return moment(time, 'HH:mm').format('h:mm a')
        else return ""
    }

    return (
        <div>
            <h3 style={{margin: '20px', color:'whitesmoke'}}>Posts</h3>
            <div>
                {Object.keys(posts).map((key, i)=>{
                    console.log('map', posts[key])
                    return (
                        <div className='mybox clickable' key={posts[key].id} onClick={()=>{
                            navigate('/posts/details?id='+posts[key].id)
                            //window.location.href='/posts/details?id='+posts[key]._id
                            }}>
                            <div className='postTitle'>{posts[key].title}</div>
                            <div className='postDate'>{posts[key].body}</div>
                           
                            <Popup ref={editref} modal nested>
                                <div>
                                    <form className='flexCenter' onSubmit={onUpdate} style={{padding:'20px'}}>
                                        <h3 style={{margin: '10px'}}>Edit post</h3>
                                        <table style={{width:'100%'}}>
                                            <tbody>
                                                <tr>
                                                    <td>Title</td>
                                                    <td><input type="text" placeholder='Title' value={selectedpost.title} className='form-control' onChange={(e)=>setselectedpost({...selectedpost, title: e.target.value})} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Date</td>
                                                    <td><input type="date" placeholder='Date' value={selectedpost.date} className='form-control' onChange={(e)=>setselectedpost({...selectedpost, date: e.target.value})} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Time</td>
                                                    <td><input type="time" placeholder='Time' value={selectedpost.time} className='form-control' onChange={(e)=>setselectedpost({...selectedpost, time: e.target.value})} /></td>
                                                </tr>
                                                <tr>
                                                    <td>Venue</td>
                                                    <td><input type="text" placeholder='Venue' value={selectedpost.venue} className='form-control' onChange={(e)=>setselectedpost({...selectedpost, venue: e.target.value})} /></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <button type='submit' className='mybutton'>Save</button>
                                    </form>
                                    
                                </div>
                            </Popup>
                        </div>
                    )
                })}
            </div>
            <button className='myfab' onClick={()=>{
                    newpost = {
                        title: '',
                        date: '',
                        time: '',
                        venue: ''
                    }
                    formref.current.open()
                }}>+</button>
            <Popup ref={formref} modal nested>
                <form className='flexCenter' onSubmit={onSubmit} style={{padding:'20px'}}>
                    <h3 style={{margin: '10px'}}>New post</h3>
                    <table style={{width:'100%'}}>
                        <tbody>
                            <tr>
                                <td>Title</td>
                                <td><input type="text" placeholder='Title' className='form-control' onChange={(e)=>newpost.title = e.target.value} /></td>
                            </tr>
                            <tr>
                                <td>Date</td>
                                <td><input type="date" placeholder='Date' className='form-control' onChange={(e)=>newpost.date = e.target.value} /></td>
                            </tr>
                            <tr>
                                <td>Time</td>
                                <td><input type="time" placeholder='Time' className='form-control' onChange={(e)=>newpost.time = e.target.value} /></td>
                            </tr>
                            <tr>
                                <td>Venue</td>
                                <td><input type="text" placeholder='Venue' className='form-control' onChange={(e)=>newpost.venue = e.target.value} /></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type='submit' className='mybutton'>Add</button>
                </form>
            </Popup>
        </div>
    );
}

export default Posts;






/*





class Posts extends Component {

    constructor(props) {
        super(props)

        

        state = {
            selectedpost: {},
            posts: {}
        }

    }

    shouldComponentUpdate (last, news) {
        console.log(news)
        return true
    }

    

    render() {
        
    }
}

export default Posts;
*/