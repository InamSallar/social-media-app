const usersCollection = require('../db').db().collection('users')
const followsCollection = require('../db').db().collection('follows')
const ObjectID = require('mongodb').ObjectID
const User = require('./User')

let Follow = function (followedUsername, authorID) {

    this.followedUsername = followedUsername,
        this.authorID = authorID,
        this.errors = []

}
Follow.prototype.cleanUp = async function () {
    if (typeof (this.followedUsername) != "string") {
        this.followedUsername = ""
    }

}

Follow.prototype.validate = async function (action) {
    // followed username must exist in database
    let followedAccount = await usersCollection.findOne({username: this.followedUsername})
    if (followedAccount) {
        this.followedID = followedAccount._id

    } else {
        this.errors.push("You can not follow a user that does not exist.")
    }
    let doesFollowAlreadyExist = await followsCollection.findOne({
        followedID: this.followedID,
        authorID: new ObjectID(this.authorID)
    })
    if (action == "create") {
        if (doesFollowAlreadyExist) {
            this.errors.push("You are already following this user.")
        }
    }
    if (action == "delete") {
        if (!doesFollowAlreadyExist) {
            this.errors.push("You can not stop following some one you do not already follow.")
        }
    }
    // should not be able to follow yourself
    if (this.followedID.equals(this.authorID)) {
        this.errors.push("You cannot follow yourself.")
    }

}

Follow.prototype.create = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate("create")
        if (!this.errors.length) {
            await followsCollection.insertOne({followedID: this.followedID, authorID: new ObjectID(this.authorID)})
            resolve()
        } else {
            reject(this.errors)
        }
    })
}
Follow.prototype.delete = function () {
    return new Promise(async (resolve, reject) => {
        this.cleanUp()
        await this.validate("delete")
        if (!this.errors.length) {
            await followsCollection.deleteOne({followedID: this.followedID, authorID: new ObjectID(this.authorID)})
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

Follow.isVisitorFollowing = async function (followedID, visitorID) {
    let followDoc = await followsCollection.findOne({followedID: followedID, authorID: new ObjectID(visitorID)})
    if (followDoc) {
        return true
    } else {
        return false
    }

}
Follow.getFollowersById = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let followers = await followsCollection.aggregate([
                {$match: {followedID: id}},
                {$lookup: {from: "users", localField: "authorID", foreignField: "_id", as: "userDoc"}},
                {
                    $project: {
                        username: {$arrayElemAt: ["$userDoc.username", 0]},
                        email: {$arrayElemAt: ["$userDoc.email", 0]}
                    }
                }
            ]).toArray()
            followers = followers.map(follower => {
                let user = new User(follower, true)
                return {username: follower.username, avatar: user.avatar}
            })
            resolve(followers)
        } catch {
            reject()
        }
    })
}
Follow.getFollowingById = function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let followers = await followsCollection.aggregate([
                {$match: {authorID: id}},
                {$lookup: {from: "users", localField: "followedID", foreignField: "_id", as: "userDoc"}},
                {
                    $project: {
                        username: {$arrayElemAt: ["$userDoc.username", 0]},
                        email: {$arrayElemAt: ["$userDoc.email", 0]}
                    }
                }
            ]).toArray()
            followers = followers.map( follower => {
                let user = new User(follower, true)
                return {username: follower.username, avatar: user.avatar}
            })
            resolve(followers)

        } catch {
            reject()
        }

    })
}
Follow.countFollowersById = function (id) {
    return new Promise( async (resolve, reject) => {
        let followersCount = followsCollection.countDocuments({followedID: id})
        resolve(followersCount)
    })
}
Follow.countFollowingById = function (id) {
    return new Promise( async (resolve, reject) => {
        let followingCount = followsCollection.countDocuments({authorID: id})
        resolve(followingCount)
    })
}

module.exports = Follow