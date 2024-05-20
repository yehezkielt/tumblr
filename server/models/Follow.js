const { database } = require("../config/mongodb");

class Follow {
    static followCollection() {
        return database.collection("follow");
    }

    static async getAll() {
        const user = await this.followCollection().find().toArray();
        return user;
    }

    static async createFollow(payload) {
        const result = await this.followCollection().insertOne(payload);
        return result;
    }

    static async findAll() {
        const agg = [
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followerId",
                    foreignField: "_id",
                    as: "followerUser",
                },
            },
            {
                $lookup: {
                    from: "user",
                    localField: "followingId",
                    foreignField: "_id",
                    as: "followingUser",
                },
            },
        ]
        const cursor = this.followCollection().aggregate(agg)
        const result = await cursor.toArray()
        return result
    }

    static async deleteFollow(followingId, followerId) {
        const result = await this.followCollection().deleteOne({
            followingId,
            followerId
        })
        return result
    }
}

module.exports = Follow;
