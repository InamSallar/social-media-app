const dotenv = require('dotenv')
const mongodb = require('mongodb')

dotenv.config()

mongodb.connect(process.env.CONNECTIONSTRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, function (err, client) {
    module.exports = client
    const app = require('./app')
    app.listen(5500)

})
