const { GraphQLError } = require("graphql");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const User = require("../models/User");
const validator = require('validator');

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type User {
    _id: ID
    name: String!
    username: String!
    email: String!
    password: String
    followerDetail: [UserDetail]
    followingDetail: [UserDetail]
    userPost: [UserPost]
  }

  type UserPost {
    _id: ID
    content: String!
    tags: [String]
    imgUrl: String!
    authorId: ID!
    comments: [Comment]
    likes: [Like]
    createdAt: Date!
    updatedAt: Date!
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

  type UserDetail {
    _id: ID
    name: String!
    username: String!
    email: String!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    userById(_id: ID): User
    searchUser(username: String!): [User],
    myProfile: User
  }

  type Token {
    accessToken: String
  }

  type Mutation {
    register(name: String!, username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): Token  }

#   input NewUser {
#     _id: ID
#     name: String
#     username: String
#     email: String
#     password: String
#   }
`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        userById: async (_, { _id }, { auth }) => {
            auth()
            if (!_id) throw new GraphQLError("User not found", {
                extensions: {
                    code: 'USER_NOT_FOUND',
                },
            })
            const users = await User.getDetail(_id)
            return users
        },
        searchUser: async (_, { username }, { auth }) => {
            auth()
            if (!username) throw new GraphQLError("Username required", {
                extensions: {
                    code: 'USERNAME_INVALID',
                },
            })
            const user = await User.getByUsername(username)
            if (!user) throw new GraphQLError("User not found", {
                extensions: {
                    code: 'USER_NOT_FOUND',
                },
            })

            return user
        },
        myProfile: async (_, __, { auth }) => {
            const data = auth()
            const myProfile = await User.myProfile(data.id)
            return myProfile
        }
    },
    Mutation: {
        register: async (_, { name, username, email, password }) => {

            if (!name) throw new GraphQLError("Name is required", {
                extensions: {
                    code: 'INVALID_NAME',
                },
            })
            if (!username) throw new GraphQLError("Username is required", {
                extensions: {
                    code: 'INVALID_USERNAME',
                },
            })
            if (!email) throw new GraphQLError("Email is required", {
                extensions: {
                    code: 'INVALID_EMAIL',
                },
            })
            if (!password) throw new GraphQLError("Password is required", {
                extensions: {
                    code: 'INVALID_PASSWORD',
                },
            })

            if (password.length < 5) throw new GraphQLError("Password must be over 5 characters", {
                extensions: {
                    code: 'INVALID_PASSWORD',
                },
            })

            const isEmail = validator.isEmail(email)
            if (!isEmail) throw new GraphQLError("Wrong Email format", {
                extensions: {
                    code: 'INVALID_EMAIL',
                },
            })

            const uniqueEmail = await User.findByEmail(email)
            if (uniqueEmail) throw new GraphQLError("Email already exist", {
                extensions: {
                    code: 'INVALID_EMAIL',
                },
            })

            const uniqueUsername = await User.findByUsername(username)
            if (uniqueUsername) throw new GraphQLError("Username already exist", {
                extensions: {
                    code: 'INVALID_USERNAME',
                },
            })

            const newUser = {
                name,
                username,
                email,
                password: hashPassword(password)
            }

            const result = await User.createOne(newUser)

            newUser._id = result.insertedId;

            return newUser;
        },
        login: async (_, { username, password }) => {
            if (!username) throw new GraphQLError("Username is required", {
                extensions: {
                    code: 'INVALID_USERNAME',
                },
            })
            if (!password) throw new GraphQLError("Password is required", {
                extensions: {
                    code: 'INVALID_PASSWORD',
                },
            })

            const user = await User.findByUsername(username)
            if (!user) throw new GraphQLError("Invalid Username", {
                extensions: {
                    code: 'INVALID_USERNAME',
                },
            })

            const checkPass = comparePassword(password, user.password)
            if (!checkPass) throw new GraphQLError("Invalid Password", {
                extensions: {
                    code: 'INVALID_PASSWORD',
                },
            })

            const token = {
                accessToken: signToken({ id: user._id, username: user.username })
            }

            return token
        }
    },
};

module.exports = { typeDefs, resolvers };
