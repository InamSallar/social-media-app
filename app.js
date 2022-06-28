const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const markdwon = require('marked')
const sanitizeHTML = require('sanitize-html')
const csrf = require('csurf')

const app = express()


let sessionOptions = session({
    secret: "JS is wonderful",
    store: new MongoStore({client: require('./db')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true}
})
app.use(sessionOptions)

app.use(flash())

app.use(function (req, res, next) {
    // make our markdown function available within our ejs templates
    res.locals.filterUserHTML = function (content) {
        return sanitizeHTML(markdwon(content), {
            allowedTags: ['p', 'i', 'ul', 'ol', 'br', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'em', 'strong', 'bold',],
            allowedAttributes: {}
        })
    }
    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")
    // make current user id available on the request object
    if (req.session.user) {
        req.visitorID = req.session.user._id
    } else {
        req.visitorID = 0
    }
    // make user session data available within view templates
    res.locals.user = req.session.user
    next()
})

app.use(csrf())
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
})

const router = require('./router')

app.use(function (err, req, res, next) {
    if (err) {
        if (err.code == "EBADCSRFTOKEN") {
            req.flash("errors", "Cross site request forgery detected.")
            req.session.save(() => res.redirect('/'))
        } else {
            res.render("404")
        }
    }
})

app.use(express.static('public'))
app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({extended: false}))


app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)


const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.use(function (socket, next) {
    sessionOptions(socket.req, socket.req.res, next)
})


io.on('connection', function (socket) {
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    if (socket.req.session.user) {
        let user = socket.req.session.user

        socket.emit("welcome", {username: user.username, avatar: user.avatar})
        socket.on("chatMessageFromBrowser", function (data) {
            socket.broadcast.emit("chatMessageFromServer", {
                message: sanitizeHTML(data.message, {
                    allowedTags: [],
                    allowedAttributes: {}
                }), username: user.username, avatar: user.avatar
            })
        })
    }
})


const dotenv = require('dotenv')
const mongodb = require('mongodb')

dotenv.config()
server.listen(process.env.PORT)

module.exports = app