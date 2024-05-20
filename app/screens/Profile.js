import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, TouchableOpacity, RefreshControl, TouchableHighlight } from "react-native";
import { gql, useQuery } from "@apollo/client";



const data1 = [{ key: "1" }];

const MY_PROFILE = gql`
  query Posts {
    myProfile {
      _id
      name
      username
      email
      password
      followerDetail {
        _id
        name
        username
        email
      }
      followingDetail {
        _id
        name
        username
        email
      }
      userPost {
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
      }
    }
  }
`;

export default function Profile({ navigation }) {
    const { loading, error, data, refetch } = useQuery(MY_PROFILE, {
        notifyOnNetworkStatusChange: true,
        refetchQueries: [{ query: MY_PROFILE }],
    });

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await SecureStorage.deleteItemAsync('accessToken');
        setIsSignedIn(false)
    };


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    const RenderItem = ({ item }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                >
                    <Image
                        source={{ uri: item.imgUrl }}
                        style={{
                            height: 200,
                            flex: 1,
                            marginEnd: 2,
                            marginBottom: 2,
                            alignItems: "center",
                        }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <FlatList
            style={{ flex: 1, backgroundColor: "#001935" }}
            data={data1}
            renderItem={() => (
                <>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                            />
                        }
                    >
                        <View style={Styles.container}>
                            <TouchableOpacity>
                                <Image
                                    source={{
                                        uri: "https://i.pinimg.com/564x/c5/36/0c/c5360c8f25831a00ffed76ea27433ce9.jpg",
                                    }}
                                    style={Styles.prfilePicture}
                                />
                            </TouchableOpacity>

                            <View style={Styles.container2}>

                                <View style={Styles.container3}>
                                    <TouchableOpacity>
                                        <Text style={Styles.numberContainer}>
                                            {data.myProfile.userPost.length}
                                        </Text>
                                        <Text style={Styles.text}>Posts</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={Styles.container3}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Follower")}
                                    >
                                        <Text style={Styles.numberContainer}>
                                            {data.myProfile.followerDetail.length}
                                        </Text>
                                        <Text style={Styles.text}>Followers</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={Styles.container3}>
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("Following")}
                                    >
                                        <Text style={Styles.numberContainer}>
                                            {data.myProfile.followingDetail.length}
                                        </Text>
                                        <Text style={Styles.text}>Following</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: "column",
                                marginStart: 10,
                                marginTop: 20,
                            }}
                        >
                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ color: "black", fontWeight: "bold" }}>
                                    {data.myProfile.username}
                                </Text>
                            </View>

                            <View style={{ marginBottom: 5 }}>
                                <Text style={{ color: "black" }}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    laboris nisi ut aliquip ex ea commodo consequat
                                </Text>
                            </View>

                        </View>
                        <TouchableOpacity>
                            <View style={{ marginTop: 10 }}>
                                <View
                                    style={{
                                        flex: 1,
                                        height: 30,
                                        borderRadius: 5,
                                        marginStart: 10,
                                        marginEnd: 10,
                                        backgroundColor: "#E4E3E3",
                                        justifyContent: "center",
                                    }}
                                >
                                    <View style={{ alignItems: "center" }}>
                                        <Text style={{ color: "black" }}>Edit Profile</Text>
                                    </View>

                                </View>
                            </View>
                        </TouchableOpacity>

                        <ScrollView horizontal={true}>
                            <View
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    marginStart: 10,
                                    marginEnd: 10,
                                    marginTop: 10,
                                    marginBottom: 5,
                                    alignItems: "center",
                                }}
                            >
                                <TouchableOpacity>
                                    <View
                                        style={{
                                            backgroundColor: "#E4E3E3",
                                            width: 64,
                                            height: 64,
                                            borderRadius: 100,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            borderWidth: 1,
                                            borderColor: "#262626",
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPcAAADMCAMAAACY78UPAAAADFBMVEX29vb+/v76+vr8/PyNY2wVAAACPklEQVR4nO3dAW6DQAwFUbJ7/ztXiKSNGgQmsvH678wJeLKBKCV0WYiIiIiIaO5a74+t3lv2wdxVe5lfTUFvj73k5bvqdebZBxba/rC3so8tsCO2MPyYrQs/YavC/9++PpO8uJ1t+Zri7czAVtx0y7gVB35+dq/pneEmtt6i29Zcb9Fta6636Ea23KLjPknrBLde1nBrhBs3bty4NcKNGzdu3Brhxo0bN26NcOPGjRu3Rrhx48aNWyPcuHHjxq0Rbty4cePWCDdu3Lhxj1fr3frroDvqd7wa4+OdFKMUardva0ZR8rHVayHsUTf8vYBfG1ZgB8CzQdac4TWmveYKr8N2vayPfyV/z89dadyOm15r3H4DrzVuv4FnOy7nw6625vO6fW5l1U5vrxM8W/FFuHHjxo0b92/17t+zun0+t8z6ObXeCe7DrrfoTu5qi+72RVM25GJe7GIDd/wGPZtyKT92Kbjrn4PrbLrzH8jKwH3ZZeDe7BrwmLcMD/+5bc4nXCJfKT3sc1zxz/u1NtRje4+h/6eVwnOa34QbN27cuDXCjRs3btwa4caNGzdujXDjxo0bt0a4cePGjVsj3Lhx48atEW7cuHHj1gg3bty4cWs0q9v+Q8vsA3UO91xu60+QIn8ElpH1wiZ2WTO7s4/TvVndtoGrrfliHHj2QQZkGbjguC0DV7uJPZtxy9fONj37+MI6hkue3FtHcGH2cnCOZx9YdPsj1x721od83NczePf3aoyB30lBREREREQ39QMBLjNcGOWRMgAAAABJRU5ErkJggg=="
                                            }}
                                            style={{ width: 20, height: 20, borderRadius: 100 }}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text
                                    style={{
                                        color: "black",
                                        fontSize: 12,
                                        marginTop: 5,
                                    }}
                                >
                                    New
                                </Text>
                            </View>
                        </ScrollView>
                        <View
                            style={{
                                backgroundColor: "#DAD7D7",
                                height: 1,
                                justifyContent: "center",
                                marginTop: 10,
                            }}
                        ></View>
                        <View
                            style={{
                                justifyContent: "center",
                                alignSelf: "center",
                                marginVertical: 10,
                            }}
                        >

                        </View>

                        <TouchableHighlight style={{ backgroundColor: "#ff7f7f", width: "100%", margin: 10, padding: 10 }} onPress={handleLogout}>
                            <Text>LOGOUT</Text>
                        </TouchableHighlight>

                    </ScrollView>
                    <FlatList
                        data={data.myProfile.userPost}
                        style={{ marginTop: 2, marginStart: 2 }}
                        renderItem={({ item }) => <RenderItem item={item} />}
                        numColumns={3}
                        indicatorStyle={"black"}
                        showsVerticalScrollIndicator={true}
                    />
                </>
            )}
        />
    );
}

const Styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        backgroundColor: "#D3D3D3"
    },
    prfilePicture: {
        height: 80,
        width: 80,
        borderRadius: 100,
        marginLeft: 20,
    },
    numberContainer: {
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",
        fontSize: 15,
    },
    container2: {
        flex: 1,
        flexDirection: "row",
        alignSelf: "center",
        marginEnd: 20,
    },
    text: {
        color: "black",
        //fontWeight: 'bold',
        alignSelf: "center",
    },
    container3: {
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
    },
});
