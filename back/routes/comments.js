var express = require("express")
var router = express.Router()
var WebSocketManager = require("../managers/websocketManager")
var DatabaseManager = require('../managers/DatabaseManager')

// demo only - the api should be authorized to prevent unauthorized modification of data

router.post('/', async (req, res) => {
    const comment = new comment(req.body)
    try {
        const newcomment = await comment.save()
        res.status(201).json(newcomment)
        WebSocketManager.onAddcomment(comment)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get('/', async (req, res) => {
    let comments
    try {
        comments = await comment.find({})
        console.log(comments)
        res.json(comments)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

router.get('/details/:id', getcomment, async (req, res) => {
    try {
        res.json(res.comment)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.put('/:id', async (req, res) => {
    // for demo only
    DatabaseManager.updateCommentById(req.params.id, req.params.body)
    res.end(req.params.body)
})

router.delete('/:id', async (req, res) => {
    console.log('delete by id:' + req.params.id)
    DatabaseManager.deleteCommentById(req.params.id)
    res.end("success")
})

async function getcomment(req, res, next) {
    let comment
    try {
        comment = await comment.findById(req.params.id)
        if (comment == null) {
            return res.status(404).json({message: 'comment not found'})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.comment = comment
    next()
}

module.exports = router