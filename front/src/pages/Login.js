import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({updateState}) => {

    let navigate = useNavigate()
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    async function loginUser(credentials) {
        // for demo
        return {token: "tokenexample", isadmin: true}

        // for non-demo
        return fetch('http://localhost:8000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })
          .then(data => {
              console.log(data.status)
              if (data.status === 200)
                return data.json()
              else
                alert('Error: ' + data.statusText)
            })
          .catch(err=>{
              alert('Error')
          })
       }
    async function handleSubmit(e) {
        e.preventDefault()
        const message = await loginUser({username: username, password: password})
        console.log('get messsage: ', message)
        localStorage.setItem('posts-app-demo.token', message.token)
        if (message) {
            // need api authorization to secure api side in case localstorage modified by hacker
            localStorage.setItem('posts-app-demo.loggedin', 'true')
            localStorage.setItem('posts-app-demo.administrator', message.isadmin)
            updateState({loggedin: true})
            navigate('/posts')
        }
    }

    return (
        <div className="mybox" style={{width: '400px'}}>
            <h3 style={{margin:'20px'}}>Login</h3>
            <form onSubmit={handleSubmit}>
                <input className="form-control" onChange={e=>{setusername(e.target.value)}} style={{marginBottom:'10px'}} type="text" placeholder="Username" />
                <input className="form-control" onChange={e=>{setpassword(e.target.value)}} type="password" placeholder="Password" />
                <button className="mybutton" type="submit">Go</button>
            </form>
        </div>
    )
}

export default Login;

/*
import React from "react"
import { Navigate } from "react-router-dom"

class Login extends React.Component {

    state = { username: '', password: '', user: {} }

    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    

    

    render () {
        return (
            <div className="mybox" style={{width: '400px'}}>
                <h3 style={{margin:'20px'}}>Login</h3>
                <form onSubmit={this.handleSubmit}>
                    <input className="form-control" onChange={e=>{this.setState({username:e.target.value})}} style={{marginBottom:'10px'}} type="text" placeholder="Username" />
                    <input className="form-control" onChange={e=>{this.setState({password:e.target.value})}} type="password" placeholder="Password" />
                    <button className="mybutton" type="submit">Go</button>
                </form>
            </div>
        )
    }
}

export default Login */