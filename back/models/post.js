const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: false
    },
    comments: {
        type: Array,
        required: false
    }
})

module.exports = mongoose.model('Post', postSchema)