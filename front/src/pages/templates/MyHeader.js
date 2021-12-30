import React from 'react';
import {Link, useNavigate} from 'react-router-dom'

const Myheader = ({loggedin, updateState}) => {
    let navigate = useNavigate()

    return (
        <div className='mybox' style={{backgroundColor:'white', display:'flex', justifyContent:'right'}}>
            {loggedin?
            <button className='mybutton redbutton' onClick={
                ()=>{
                    localStorage.removeItem('posts-app-demo.token')
                    localStorage.removeItem('posts-app-demo.loggedin')
                    localStorage.removeItem('posts-app-demo.administrator')
                    updateState({loggedin: false})
                    navigate('/')
                }
            }>Logout</button>
            :<button className='mybutton greenbutton testclass'>Login</button>}
            <div>
      </div>
        </div>
    );
}

export default Myheader;

