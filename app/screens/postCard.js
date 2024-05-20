import { View, Text, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import Card from "../components/Card";
import { FontAwesome5 } from "@expo/vector-icons";



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

function Home({ navigation }) {
    const { loading: loading2, error: error2, data: data2, refetch: refetch2 } = useQuery(MY_PROFILE);
    const { loading, error, data, refetch } = useQuery(GET_POSTS, {
        notifyOnNetworkStatusChange: true
    });

    const [refreshing, setRefreshing] = useState(false)
    let flag = false

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        await refetch2()
        flag = false
        setRefreshing(false);
    };

    const handleAdd = () => {
        navigation.navigate("Add")
    };

    let user = data2?.myProfile;

    if (loading || loading2) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator
                    size="large" />
            </View>
        );
    }

    if (error || error2) {
        return <Text style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>Error: {error.message}</Text>;
    }

    console.log(data.posts);
    return (
        <ScrollView

            style={{ backgroundColor: "#001935" }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>

            <TouchableHighlight style={{}} onPress={() => navigation.navigate('Search')}>
                <Text style={{ textAlign: "center", color: "white", margin: 10 }}>Search..</Text>
            </TouchableHighlight>

            {data?.posts.map((post, index) => (
                <Card key={index} post={post} flag={flag} user={user} refetch={refetch} id={post._id} navigate={navigation.navigate} />
            ))}

            <TouchableOpacity onPress={handleAdd}>
                <FontAwesome5
                    style={{ marginLeft: 10, marginBottom: 7 }}
                    name="plus"
                    size={35}
                    color="white"
                />
            </TouchableOpacity>

        </ScrollView>
    );
}

export default Home;
