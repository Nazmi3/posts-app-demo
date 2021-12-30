var webSocketServer = require('websocket').server
var UserManager = require('./UserManager')

class WebSocketManager {

    static init (server) {
        var main = this
        
        main.clients = {}
        
        const wsServer = new webSocketServer({httpServer: server})
        
        wsServer.on('request', function (request) {
            const parameters = request.resourceURL.query
            var token = parameters.token
            var user = UserManager.getByToken(token)
            if (!user) {
                request.reject()
                console.log("Request rejected")
                return
            }
            const connection = request.accept(null, request.origin)
            main.clients[user.id] = connection
            console.log('Connected: ' + user.username + ' in ' + Object.getOwnPropertyNames(main.clients).length + ' clients')
            connection.on('message', function (message) {
                if (message.type = 'utf8') {
                console.log("Received message: " + message.utf8Data)
                for (key in this.clients) {
                    this.clients[key].sendUTF(message.utf8Data)
                    console.log("Sent message to: " + clients[key])
                }
                }
            })
        })
        wsServer.on('close', function (request) {
            console.log('on close')
        })
    }

    static onAddEvent (event) {
        for (const [key, value] of Object.entries(this.clients)) {
            this.clients[key].sendUTF(JSON.stringify({
                type: "addevent",   
                message: event
            }))
            console.log("Sent message to: " + key)
        }
    }

    static onUpdateEvent (event) {
        for (const [key, value] of Object.entries(this.clients)) {
            this.clients[key].sendUTF(JSON.stringify({
                type: "updateevent",
                message: event
            }))
        }
    }

    static onDeleteEvent (eventid) {
        console.log("ondelete", eventid)
        for (const [key, value] of Object.entries(this.clients)) {
            this.clients[key].sendUTF(JSON.stringify({
                type: "deleteevent",
                message: eventid,
                check: 'ok'
            }))
        }
    }
      
}

module.exports = WebSocketManager
