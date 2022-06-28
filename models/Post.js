const postsCollection = require('../db').db().collection("posts")
const followsCollection = require('../db').db().collection("follows")
const ObjectId = require('mongodb').ObjectID
const User = require('./User')
const sanitizeHTML = require('sanitize-html')

let Post = function (data, userId, requestedPostID) {
    this.data = data
    this.errors = []
    this.userId = userId
    this.requestedPostID = requestedPostID
}

Post.prototype.cleanUp = function () {
    if (typeof (this.data.title) != "string") {
        this.data.title = ""
    }
    if (typeof (this.data.body) != "string") {
        this.data.body = ""
    }

    // get rid of any bogus properties
    this.data = {
        title: sanitizeHTML(this.data.title.trim(), {allowedTags: [], allowedAttributes: {}}),
        body: sanitizeHTML(this.data.body.trim(), {allowedTags: [], allowedAttributes: {}}),
        createdDate: new Date(),
        author: ObjectId(this.userId)
    }
}

Post.prototype.validate = function () {

    if (this.data.title == "") {
        this.errors.push("You must provide a post title.")
    }
    if (this.data.body == "") {
        this.errors.push("You must provide post contents.")
    }

}

Post.prototype.create = function () {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()

        if (!this.errors.length) {
            // save post to database
            postsCollection.insertOne(this.data).then((info) => {
                resolve(info.ops[0]._id)
            }).catch(() => {
                this.errors.push("Please try again later.")
                reject(this.errors)
            })
        } else {
            reject(this.errors)
        }
    })

}
Post.prototype.update = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await Post.findSingleByID(this.requestedPostID, this.userId)

            if (post.isVisitorOwner) {
                // actually update the db
                let status = await this.actuallyUpdate()
                resolve(status)
            } else {
                reject()
            }
        } catch {
            reject()
        }
    })
}

Post.reusablePostQuery = function (uniqueOperations, visitorID) {
    return new Promise(async function (resolve, reject) {
        let aggOperations = uniqueOperations.concat([
            {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
            {
                $project: {
                    title: 1,
                    body: 1,
                    createdDate: 1,
                    authorID: "$author",
                    author: {$arrayElemAt: ["$authorDocument", 0]}
                }
            }
        ])
        let posts = await postsCollection.aggregate(aggOperations).toArray()

        // cleanup author property in each post object
        posts = posts.map(function (post) {
            post.isVisitorOwner = post.authorID.equals(visitorID)
            post.authorID = undefined

            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post

        })
        resolve(posts)
    })
}

Post.findSingleByID = function (id, visitorID) {
    return new Promise(async function (resolve, reject) {
        if (typeof (id) != "string" || !ObjectId.isValid(id)) {
            reject()
            return
        }
        let posts = await Post.reusablePostQuery([
            {$match: {_id: new ObjectId(id)}}
        ], visitorID)

        if (posts.length) {
            resolve(posts[0])
        } else {
            reject()
        }
    })
}

Post.findByAuthorID = function (authorID) {
    return Post.reusablePostQuery([
        {$match: {author: authorID}},
        {$sort: {createdDate: -1}}
    ])

}

Post.prototype.actuallyUpdate = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        this.validate()
        if (!this.errors.length) {
            await postsCollection.findOneAndUpdate({_id: new ObjectId(this.requestedPostID)}, {
                $set: {
                    title: this.data.title,
                    body: this.data.body
                }
            })
            resolve("success")
        } else {
            resolve("failure")
        }

    })
}

Post.delete = function (postIdToDelete, currentUserId) {
    return new Promise(async (resolve, reject) => {
        try {
            let post = await Post.findSingleByID(postIdToDelete, currentUserId)
            if (post.isVisitorOwner) {
                await postsCollection.deleteOne({_id: new ObjectId(postIdToDelete)})
                resolve()
            } else {
                reject()
            }

        } catch {
            reject()
        }
    })
}

Post.search = function (searchTerm) {
    return new Promise(async (resolve, reject) => {
        if (typeof (searchTerm) == "string") {
            let posts = await Post.reusablePostQuery([

                {$match: {$text: {$search: searchTerm}}},
                // {$sort: {score: {$meta: "textScore"}}}
                // {$match: {title: searchTerm}},
                {$sort: {createdDate: -1}}
            ])
            resolve(posts)
        } else {
            reject()
        }
    })
}

Post.countPostsByAuthor = function (id) {
    return new Promise( async (resolve, reject) => {
        let postCount = await postsCollection.countDocuments({author: id})
        resolve(postCount)
    })
}

Post.getFeed = async function (id) {
    // create an array of the users ids that the current user follows
    let followedUsers = await followsCollection.find({authorID: new ObjectId(id)}).toArray()
    followedUsers = followedUsers.map(function (followDoc) {
        return followDoc.followedID
    })
    // look for posts where the author is in the above array of followed users
    return Post.reusablePostQuery([
        {$match: {author: {$in: followedUsers}}},
        {$sort: {createdDate: -1}}
    ])
}

module.exports = Post