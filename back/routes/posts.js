var express = require("express")
var router = express.Router()
var WebSocketManager = require("../managers/websocketManager")
const Post = require('../models/post')

var DatabaseManager = require('../managers/DatabaseManager')

router.post('/', async (req, res) => {
    try {
        let result = DatabaseManager.addPost(req.body)
        res.status(201).json(result)
        WebSocketManager.onAddPost(Post)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/', async (req, res) => {
    let posts
    try {
        posts = await Post.find({})
        console.log(posts)
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.get('/details/:id', getPost, async (req, res) => {
    //demo
    res.end('success')
    return
    try {
        res.json(res.post)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id', getPost, async (req, res) => {
    let newPost = req.body
    try {
        await Post.findByIdAndUpdate(req.params.id, newPost)
        res.json(newPost)
        WebSocketManager.onUpdatePost(newPost)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.delete('/:id', async (req, res) => {
    console.log('delete by id:' + req.params.id)
    DatabaseManager.deleteCommentById(req.params.id)
})

async function getPost(req, res, next) {
    let post
    try {
        post = await Post.findById(req.params.id)
        if (post == null) {
            return res.status(404).json({message: 'post not found'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.post = post
    next()
}

module.exports = router