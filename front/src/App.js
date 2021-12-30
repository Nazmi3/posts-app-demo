import './App.css';
import React from 'react'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Posts from './pages/Posts'
import PostDetails from './pages/PostDetails'
import './style.css'
import './bootstrap/dist/css/bootstrap.min.css'
import MyHeader from './pages/templates/MyHeader'
class App extends React.Component {

  constructor(props) {
    super(props)
    console.log('constructed app')
    this.state = {
      loggedin:localStorage.getItem('posts-app-demo.loggedin')
    }
    this.updateState = this.updateState.bind(this)
  }

  componentWillReceiveProps (np) {
    console.log('will receive props')
  }

  updateState (newstate) {
    this.setState(newstate)
  }

  render () {
    console.log('rendering')
    return (
      <div>
        <Router>
          <MyHeader loggedin = {this.state.loggedin} updateState={this.updateState}/>
          
          <div className='App flexCenter'>
            <Routes>
              <Route path="/" element={<Home updateState={this.updateState}/>} />
              <Route path="/login" element={<Login updateState={this.updateState}/>} />
              <Route path="/posts" element={<Posts/>} />
              <Route path="/posts/details" element={<PostDetails/>} />
            </Routes>
          </div>
        </Router>
      </div>
    )
  }
}

export default App;
