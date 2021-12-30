import { Navigate } from 'react-router-dom'

function Home() {
    if (localStorage.getItem('posts-app-demo.loggedin')==='true')
        return <Navigate to="/posts" />
    else
        return <Navigate to="/login" />
}

export default Home