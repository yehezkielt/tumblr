const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class User {
    static userCollection() {
        return database.collection("user");
    }

    static async getAll() {
        const user = await this.userCollection().find().toArray();
        return user;
    }

    static async register(newUser) {
        const { name, email, password, username } = newUser;
        const query = { email };
        const notUnique = await this.userCollection().findOne(query);
        if (notUnique) throw new Error("Email not unique");
        const user = this.userCollection();
        const result = await user.insertOne(newUser);
        return result;
    }

    static async findByEmail(email) {
        const findUser = await this.userCollection().findOne({
            email: email,
        });
        return findUser;
    }

    static async findByUsername(username) {
        const findUser = await this.userCollection().findOne({
            username: username,
        });
        return findUser;
    }

    static async createOne(payload) {
        const newUser = await this.userCollection().insertOne(payload);
        return newUser;
    }

    static async getDetail(id) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(String(id)),
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "followers",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followers.followerId",
                    foreignField: "_id",
                    as: "followerDetail",
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "followings",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followings.followingId",
                    foreignField: "_id",
                    as: "followingDetail",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "authorId",
                    as: "userPost",
                },
            },
            {
                $project: {
                    password: 0,
                    "followingDetail.password": 0,
                    "followerDetail.password": 0,
                },
            },
        ];
        const cursor = this.userCollection().aggregate(agg);
        const result = await cursor.toArray();
        return result[0];
    }

    static async getByUsername(username) {
        const agg = [
            {
                $match: {
                    username: { $regex: new RegExp(username, "i") },
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "followers",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followers.followerId",
                    foreignField: "_id",
                    as: "followerDetail",
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "followings",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followings.followingId",
                    foreignField: "_id",
                    as: "followingDetail",
                },
            },
            {
                $project: {
                    password: 0,
                    "followingDetail:password": 0,
                    "followerDetail:password": 0,
                },
            },
        ];
        const cursor = this.userCollection().aggregate(agg);
        const result = await cursor.toArray();
        return result;
    }

    static async myProfile(id) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(String(id)),
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followingId",
                    as: "followers",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followers.followingId",
                    foreignField: "_id",
                    as: "followerDetail",
                },
            },
            {
                $lookup: {
                    from: "follow",
                    localField: "_id",
                    foreignField: "followerId",
                    as: "following",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "following.followingId",
                    foreignField: "_id",
                    as: "followingDetail",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "authorId",
                    as: "userPost",
                },
            },
        ];
        const cursor = this.userCollection().aggregate(agg);
        const result = await cursor.toArray();
        return result[0];
    }
}

module.exports = User;
