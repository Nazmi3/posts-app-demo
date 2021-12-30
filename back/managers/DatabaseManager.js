var url = "mongodb://localhost";
var MongoClient = require('mongodb').MongoClient;


class WebSocketManager {

    static init (server) {
        var main = this
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            console.log("Connected to database 2!");
            main.dbo = db.db("rte");
          });
    }

    static deleteCommentById (commentid) {
        this.dbo.collection("posts").updateMany({"comments.id":commentid}, {$pull:{"comments":{id:commentid}}}, function(err, result) {
            if (err) throw err;
             console.log('comment deleted');
        });
    }

    static updateCommentById (commentid, comment) {
        this.dbo.collection("posts").updateMany({"comments.id":commentid}, {$set:{"comments.id":{id:commentid}, comment}}, function(err, result) {
            if (err) throw err;
             console.log('comment updated');
        });
    }

    static addPost (post) {
        return this.dbo.collection("posts").insertOne(post)
    }
      
}

module.exports = WebSocketManager
