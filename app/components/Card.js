import { View, Text, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Feather } from "@expo/vector-icons";

const LIKE_POST = gql`
  mutation Mutation($id: ID!) {
    likePost(_id: $id) {
      username
      createdAt
      updatedAt
    }
  }
`;

const UNLIKE_POST = gql`
  mutation Mutation($id: ID!) {
    unlikePost(_id: $id) {
      username
      createdAt
      updatedAt
    }
  }
`;

const GET_POSTS = gql`
  query Query {
  posts {
    _id
    content
    tags
    imgUrl
    authorId
    comments {
      content
      username
      createdAt
      updatedAt
    }
    likes {
      username
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    author {
      _id
      name
      username
      email
    }
  }
}
`

function Card({ post, id, navigate, user, flag }) {
    const [liked, setLiked] = useState(false);

    const [likePost] = useMutation(LIKE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });
    const [unlikePost] = useMutation(UNLIKE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    post.likes.map((item) => {
        if (item.username === user.username) {
            flag = true;
        }
    });

    const toggleLike = async () => {
        try {
            if (flag) {
                await unlikePost({ variables: { id } });
            } else {
                await likePost({ variables: { id } });
            }
            setLiked(!liked);
        } catch (error) {
            console.error("Error di like:", error.message);
            Alert.alert("Error!", error.message);
        }
    };


    const toggleProfile = async () => {
        try {
            if (post.authorId === user._id) {
                navigate("Profile")
            } else {
                navigate("Profile", { id: post.authorId })
            }
        } catch (error) {
            console.log("Error di profile", error.message);
            Alert.alert("Error!", error.message);
        }
    }

    return (
        <View style={styles.card}>

            <TouchableOpacity onPress={toggleProfile}>
                <View style={styles.header}>
                    <Image
                        source={{ uri: `https://i.pinimg.com/564x/e8/82/72/e8827292777dca5378d3c75899029883.jpg` }}
                        style={styles.avatar}
                    />
                    <View style={{ flexDirection: "column" }}>
                        <Text style={styles.username}>{post.author.username}</Text>
                        <Text style={styles.tags}>{post.tags}</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <Image
                source={{
                    uri: post.imgUrl,
                }}
                style={styles.image}
            />

            <View style={styles.footer}>
                <View style={styles.caption}>
                    <TouchableOpacity onPress={toggleLike}>
                        <AntDesign
                            name={flag ? "heart" : "hearto"}
                            size={24}
                            color={flag ? "red" : "black"}
                            style={styles.iconHeart}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigate("Comments", { id: post._id })}
                    >
                        <FontAwesome
                            name="commenting"
                            size={24}
                            color="black"
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Feather
                            name="send"
                            size={24}
                            color="black"
                            style={styles.iconShare}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.count}>
                    <Text style={styles.countText}>{post.likes.length} likes</Text>
                </View>

                <View style={{ marginHorizontal: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.description}>
                            <Text style={[styles.textFooter, { marginRight: 5 }]}>
                                {post.author.username}
                                {"  "}
                            </Text>
                            {post.content}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{ marginTop: 5 }}
                        onPress={() => navigate("Comments", { id: post._id })}
                    >
                        <Text style={{ color: "#999" }}>
                            View all {post.comments.length} comments
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderColor: "#fff",
        marginBottom: 0,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginLeft: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
    },
    image: {
        width: "100%",
        height: 500,
    },
    footer: {
        padding: 10,
    },
    caption: {
        flexDirection: "row",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 5,
        marginStart: 5,
        marginTop: -5,
    },
    iconHeart: {
        marginTop: 5,
        marginRight: 15,
    },
    icon: {
        marginRight: 15,
        fontSize: 25,
        alignItems: "center",
        alignContent: "center",
    },
    iconShare: {
        marginRight: 15,
        fontSize: 23,
        alignItems: "center",
        alignContent: "center",
        marginTop: 6,
    },
    count: {
        flexDirection: "row",
        alignItems: "center",
        fontSize: 14,
        marginBottom: 5,
        marginStart: 0,
        marginTop: -5,
    },
    countText: {
        marginTop: 5,
        marginLeft: 10,
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
        fontWeight: "400",
    },
    textFooter: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16,
    },
    tags: {
        fontSize: 12,
        marginTop: 1,
        color: "black",
    },
});

export default Card;
