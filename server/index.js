if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
const { typeDefs: userTypeDefs, resolvers: userResolvers } = require("./schema/user")
const { typeDefs: postsTypeDefs, resolvers: postsResolvers } = require("./schema/posts")
const { typeDefs: followTypeDefs, resolvers: followResolvers } = require("./schema/follow")
const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require("graphql")
const { verifyToken } = require("./helpers/jwt")


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs: [userTypeDefs, postsTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postsResolvers, followResolvers],
    introspection: true,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

(async () => {
    const { url } = await startStandaloneServer(server, {
        listen: { port: process.env.PORT || 4000 },
        context: ({ req, res }) => {
            return {
                auth: () => {
                    const auth = req.headers.authorization
                    if (!auth) throw new GraphQLError("Invalid Token", {
                        extensions: {
                            code: 'INVALID_TOKEN',
                        }
                    })

                    const [type, token] = auth.split(" ")
                    if (!token) throw new GraphQLError("Invalid Token", {
                        extensions: {
                            code: 'INVALID_TOKEN',
                        }
                    })
                    if (type !== "Bearer") throw new GraphQLError("Invalid Token", {
                        extensions: {
                            code: 'INVALID_TOKEN',
                        }
                    })

                    const verify = verifyToken(token)
                    if (!verify) throw new GraphQLError("Invalid Token", {
                        extensions: {
                            code: 'INVALID_TOKEN',
                        }
                    })

                    return verify
                }
            }
        }
    })
    console.log(`🚀 Server ready at ${url}`);
})()
