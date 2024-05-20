const { ObjectId } = require("mongodb");
const Follow = require("../models/Follow");

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
scalar Date

type Follow {
    _id: ID
    followingId: ID
    followerId: ID
    createdAt: Date
    updatedAt: Date
    followerUser: [follower]
    followingUser: [following]
}

type follower {
    _id: ID,
    name: String,
    username: String,
    email: String
}

type following {
    _id: ID,
    name: String,
    username: String,
    email: String
}

  type Query {
    follows: [Follow]
}

type Mutation {
    followUser(_id: ID!): Follow
    unfollowUser(_id: ID!): Follow
}

#   input NewFollow {
#     _id: ID
#     followingId: ID
#     followerId: ID
#     createdAt: String
#     updatedAt: String
#   }
`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        follows: async () => {
            const result = await Follow.findAll();
            return result;
        },
    },
    Mutation: {
        followUser: async (_, { _id }, { auth }) => {
            auth();
            const currentUser = auth();

            const followerId = new ObjectId(String(currentUser.id));
            const followingId = new ObjectId(String(_id));

            const newFollow = {
                followingId,
                followerId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            const result = await Follow.createFollow(newFollow);
            newFollow._id = result.insertedId;
            return newFollow;
        },
        unfollowUser: async (_, { _id }, { auth }) => {
            try {
                auth();
                const currentUser = auth();

                const followerId = new ObjectId(String(currentUser.id));
                const followingId = new ObjectId(String(_id));

                const deleteResult = await Follow.deleteFollow(followingId, followerId);

                return deleteResult;
            } catch (error) {
                throw error;
            }
        },
    },
};

module.exports = { typeDefs, resolvers };
