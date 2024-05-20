const { ObjectId } = require("mongodb")
const { database } = require("../config/mongodb")
const redis = require("../config/redis")

class Posts {
    static postsCollection() {
        return database.collection("posts")
    }

    static async getAll() {
        const posts = await this.postsCollection().find().toArray()
        return posts
    }

    static async findAll() {
        const redisPosts = await redis.get("posts")
        if (redisPosts) {
            return JSON.parse(redisPosts)
        } else {
            const agg = [
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: "user",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    $unwind: {
                        path: "$author",
                        preserveNullAndEmptyArrays: true,
                    }
                }
            ]
            const cursor = this.postsCollection().aggregate(agg)
            const result = await cursor.toArray()
            await redis.set("posts", JSON.stringify(result))
            return result
        }
    }

    static async findById(id) {
        const agg = [
            {
                $match: {
                    _id: new ObjectId(String(id)),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]
        const cursor = this.postsCollection().aggregate(agg)
        const result = await cursor.toArray()
        return result
    }

    static async createOne(payload) {
        const newPost = await this.postsCollection().insertOne(payload)
        await redis.del("posts")
        return newPost
    }

    static async updateOne(id, update, username) {
        if (update.likes) {
            const agg = [
                {
                    $match: {
                        _id: new ObjectId(String(id))
                    }
                }
            ]
            const cursor = this.postsCollection().aggregate(agg)
            const result = await cursor.toArray()
            result[0].likes.forEach((el) => {
                if (el.username === username) throw new GraphQLError("Already liked", {
                    extensions: {
                        code: 'INVALID_LIKE',
                    },
                })
            });
        }

        const post = await this.postsCollection().updateOne(
            { _id: new ObjectId(String(id)) },
            { $push: update }
        )
        if (!post) throw new GraphQLError("Post not found", {
            extensions: {
                code: 'POST_NOT_FOUND',
            },
        })

        const agg = [
            {
                $match: {
                    _id: new ObjectId(String(id)),
                },
            },
            {
                $lookup: {
                    from: "Users",
                    localField: "authorId",
                    foreignField: "_id",
                    as: "author",
                },
            },
        ]

        const cursor = this.postsCollection().aggregate(agg)
        const result = await cursor.toArray()
        await redis.del("posts")
        return result[0]
    }

    static async unlikePost(id, username) {
        const post = await this.postsCollection().findOne({
            _id: new ObjectId(String(id))
        })
        if (!post) throw new GraphQLError("Post not found", {
            extensions: {
                code: 'POST_NOT_FOUND',
            },
        })

        const result = await this.postsCollection().updateOne(
            { _id: new ObjectId(String(id)) },
            { $pull: { likes: { username } } }
        )
        if (result.modifiedCount === 0) throw new GraphQLError("Post not found", {
            extensions: {
                code: 'POST_NOT_FOUND',
            },
        })

        const updatePost = await this.postsCollection().findOne({
            _id: new ObjectId(String(id))
        })
        await redis.del("posts")
        return updatePost

    }

}

module.exports = Posts