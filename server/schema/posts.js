const { ObjectId } = require("mongodb");
const Posts = require("../models/Posts");
const { GraphQLError } = require("graphql");

const typeDefs = `#graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
scalar Date

type Post {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String!
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: Date!
    updatedAt: Date!
    author: Author
}

type Author {
    _id: ID
    name: String
    username: String
    email: String
}

type Comment {
    content: String!
    username: String!
    createdAt: Date!
    updatedAt: Date!
}

type Like {
    username: String
    createdAt: Date!
    updatedAt: Date!
}

type Query {
    posts: [Post]
    post(_id: ID): Post
}
  
type Mutation {
    addPost(content: String!, tags: [String], imgUrl: String): Post
    commentPost(_id: ID!, content: String!): Comment
    likePost(_id: ID!): Like
    unlikePost(_id: ID!): Like
}

# input NewPosts {
#     _id: ID
#     content: String!
#     tags: [String]
#     imgUrl: String!
#     authorId: ID!
#     comments: [Comment]
#     likes: [Like]
    # createdAt: Date!
    # updatedAt: Date!
    # author: Author
# }
`;


// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        posts: async (_, __, { auth }) => {
            auth();
            try {
                const posts = await Posts.findAll();
                return posts;
            } catch (error) {
                throw error;
            }
        },
        post: async (_, args, { auth }) => {
            try {
                auth();
                if (!args._id) throw new GraphQLError("ID is required", {
                    extensions: {
                        code: 'ID_INVALID',
                    },
                })
                const post = await Posts.findById(args._id);

                return post[0];
            } catch (error) {
                throw error;
            }
        },
    },
    Mutation: {
        addPost: async (_, { content, tags, imgUrl }, { auth }) => {
            auth()
            const currentUser = auth()
            try {
                if (!content) throw new GraphQLError("Content is required", {
                    extensions: {
                        code: 'CONTENT_INVALID',
                    },
                })
                if (!imgUrl) throw new GraphQLError("imgUrl is required", {
                    extensions: {
                        code: 'imgUrl_INVALID',
                    },
                })
                if (!currentUser.id) throw new GraphQLError("Author ID is required", {
                    extensions: {
                        code: 'currentUser.id_INVALID',
                    },
                })

                const newPost = {
                    content,
                    tags,
                    imgUrl,
                    authorId: new ObjectId(String(currentUser.id)),
                    comment: [],
                    likes: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                const result = await Posts.createOne(newPost)
                newPost._id = result.insertedId

                return newPost
            } catch (error) {
                throw error
            }
        },
        commentPost: async (_, { content, _id }, { auth }) => {
            try {
                auth()
                const currentUser = auth()
                if (!content) throw new GraphQLError("Content is required", {
                    extensions: {
                        code: 'CONTENT_INVALID',
                    },
                })
                if (!_id) throw new GraphQLError("ID is required", {
                    extensions: {
                        code: 'ID_INVALID',
                    },
                })

                const newComment = {
                    content,
                    username: currentUser.username,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                const result = await Posts.updateOne(_id, { comments: newComment }, currentUser.username)
                return newComment

            } catch (error) {
                throw error
            }
        },
        likePost: async (_, { _id }, { auth }) => {
            try {
                auth()
                const currentUser = auth()
                if (!currentUser.username) throw new GraphQLError("Username is required", {
                    extensions: {
                        code: 'USERNAME_INVALID',
                    },
                })
                if (!_id) throw new GraphQLError("ID is required", {
                    extensions: {
                        code: 'ID_INVALID',
                    },
                })

                const newLike = {
                    username: currentUser.username,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }

                const result = await Posts.updateOne(_id, { likes: newLike }, currentUser.username)
                return newLike
            } catch (error) {
                throw error
            }
        },
        unlikePost: async (_, { _id }, { auth }) => {
            try {
                auth()
                const currentUser = auth()
                if (!currentUser.username) throw new GraphQLError("Username is required", {
                    extensions: {
                        code: 'USERNAME_INVALID',
                    },
                })
                if (!_id) throw new GraphQLError("ID is required", {
                    extensions: {
                        code: 'ID_INVALID',
                    },
                })

                const result = await Posts.unlikePost(_id, currentUser.username)
                return result
            } catch (error) {
                throw error
            }
        }
    },
};


module.exports = { typeDefs, resolvers };
