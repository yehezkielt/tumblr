import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    StyleSheet,
} from "react-native";
import { gql, useQuery } from "@apollo/client";
import { FontAwesome5 } from "@expo/vector-icons";



const SEARCH_USERS = gql`
  query Query($username: String!) {
    searchUser(username: $username) {
      _id
      name
      username
      email
      password
    }
  }
`;

const MY_PROFILE = gql`
  query Query {
    myProfile {
      _id
      name
      username
      email
      followingDetail {
        _id
        name
        username
        email
      }
      followerDetail {
        _id
        name
        username
        email
      }
    }
  }
`;


const FOLLOW_USER = gql`
  mutation Mutation($id: ID!) {
    followUser(_id: $id) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;


const UNFOLLOW_USER = gql`
  mutation Mutation($id: ID!) {
    unfollowUser(_id: $id) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

function Search({ navigation }) {
    const [searchText, setSearchText] = useState("");
    const [searchUsers, { loading, data }] = useQuery(SEARCH_USERS);
    const { loading: profileLoading, data: profileData } = useQuery(MY_PROFILE);

    const [isFollowing, setIsFollowing] = useState(false);
    const [followUser] = useMutation(FOLLOW_USER, {
        refetchQueries: [{ query: USER_PROFILE, variables: { id } }],
    });
    const [unfollowUser] = useMutation(UNFOLLOW_USER, {
        refetchQueries: [{ query: USER_PROFILE, variables: { id } }],
    });

    const toggleFollow = async () => {
        try {
            if (isFollowing) {
                await unfollowUser({ variables: { id: data.userById._id } });
            } else {
                await followUser({ variables: { id: data.userById._id } });
            }
            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Follow Error", error.message);
            Alert.alert("Error!", error.message);
        }
    };

    const handleSearch = () => {
        if (searchText.trim() !== "") {
            searchUsers({ variables: { username: searchText } });
        }
    };

    const myProfileId = profileData?.myProfile?._id;

    return (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20, marginTop: 30, backgroundColor: "#001935" }}>
            <View style={{ flexDirection: "row", marginBottom: 20 }}>

                <TextInput
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 1,
                        borderColor: "#D3D3D3",
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        color: "black",
                        backgroundColor: "white"
                    }}
                    placeholder="Search Users.."
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <TouchableOpacity onPress={handleSearch}>
                    <FontAwesome5
                        style={{ marginLeft: 10, marginTop: 7 }}
                        name="search"
                        size={26}
                        color="white"
                    />
                </TouchableOpacity>

            </View>

            {loading || profileLoading ? (

                <View
                    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
                >
                    <ActivityIndicator size="large" />
                </View>

            ) : data && data.searchUser && data.searchUser.length > 0 ? (

                <FlatList
                    data={data.searchUser.filter((user) => user._id !== myProfileId)}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate("Profile", { id: item._id })
                            }
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    margin: 20,

                                }}
                            >
                                <Image
                                    source={{ uri: "https://i.pinimg.com/564x/c5/36/0c/c5360c8f25831a00ffed76ea27433ce9.jpg" }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        marginRight: 10,
                                    }}
                                />

                                <Text style={{ color: "white" }}>{item.username}</Text>

                                <TouchableOpacity onPress={toggleFollow}>
                                    <View
                                        style={[
                                            Styles.button,
                                            isFollowing ? Styles.followed : Styles.follow,
                                        ]}
                                    >
                                        <Text style={Styles.buttonText}>
                                            {isFollowing ? "Followed" : "Follow"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </TouchableOpacity>
                    )}
                />
            ) : (

                <Text style={{ color: "grey" }}>No users found</Text>

            )
            }
        </View>
    );
}


const Styles = StyleSheet.create({
    button: {
        flex: 1,
        height: 30,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10,
        marginStart: 10,
        marginEnd: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    follow: {
        backgroundColor: "#fa0202",
    },
    followed: {
        backgroundColor: "#3586FF",
    },
    buttonText: {
        color: "white",
    },
})

export default Search;
