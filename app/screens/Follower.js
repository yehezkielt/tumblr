import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from "react-native";




const GET_FOLLOWS = gql`
  query Query {
    myProfile {
      _id
      name
      username
      email
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
    }
  }
`;

const Follower = ({ navigation }) => {
    const { loading, data, error } = useQuery(GET_FOLLOWS);

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

    return (
        <View style={{
            backgroundColor: "#001935"
        }}>
            <FlatList
                style={{
                    marginTop: 25,
                    marginHorizontal: 15,
                    backgroundColor: "white"
                }}
                data={data.myProfile.followerDetail}
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
                                marginBottom: 20,
                            }}
                        >

                            <Image
                                source={{
                                    uri: "https://i.pinimg.com/564x/c5/36/0c/c5360c8f25831a00ffed76ea27433ce9.jpg",
                                }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    marginRight: 10,
                                }}
                            />

                            <Text>{item.username}</Text>

                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Follower;
