class UserManager {

    // not-hashed intentionally for demo purposes
    static users = [
        {
            id: 1,
            username: 'A',
            password: 'AA',
            token: 'atoken',
            type: 'user'
        },
        {
            id: 2,
            username: 'B',
            password: 'BB',
            token: 'btoken',
            type: 'user'
        },
        {
            id: 2,
            username: 'admin',
            password: 'admin123',
            token: 'btoken',
            type: 'administrator'
        }
    ]

    static getByCredentials(credentials) {
        return this.users.find(user=>user.username === credentials.username && user.password === credentials.password)
    }

    static getByToken (token) {
        return this.users.find(user=>user.token === token)
    }

    static getAll () {
        return this.users
    }
}

module.exports = UserManager