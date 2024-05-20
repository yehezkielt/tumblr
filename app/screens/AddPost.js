import { gql, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ActivityIndicator,
    TextInput,
    Alert,
} from "react-native";




const ADD_POST = gql`
  mutation AddPost($content: String!, $tags: [String], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
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



function Add({ navigation }) {

    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [isPostSuccess, setIsPostSuccess] = useState(false);

    const [post, { loading, error }] = useMutation(ADD_POST, {
        refetchQueries: [{ query: GET_POSTS }],
    });

    async function handleAddPost() {
        try {
            await post({ variables: { content, tags, imgUrl } });
            setIsPostSuccess(true);
            navigation.navigate("Home");
        } catch (err) {
            Alert.alert("Create Post Failed", err.message);
        }
    }

    useEffect(() => {
        if (isPostSuccess) {
            setContent("");
            setTags("");
            setImgUrl("");
            setIsPostSuccess(false);
        }
    }, [isPostSuccess]);

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
        <>

            <ImageBackground source={require("../assets/background.png")} style={{ width: '100%', height: '100%' }}>

                <View style={styles.container}>

                    <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: "https://assets.tumblr.com/images/logo_page/1x/wordmark-white.png?_v=8cec4be4e8da5d4c0d64ca5c0643f655"
                        }}
                    />

                    <TextInput
                        placeholder="Description.."
                        onChangeText={setContent}
                        value={content}
                        style={styles.textInput} />

                    <TextInput
                        placeholder="#Tags.."
                        onChangeText={setTags}
                        value={tags}
                        style={styles.textInput} />

                    <TextInput
                        placeholder="Image Url.."
                        onChangeText={setImgUrl}
                        value={imgUrl}
                        style={styles.textInput} />



                    <TouchableHighlight
                        style={styles.button}
                        title="Create Post"
                        onPress={handleAddPost}>
                        <Text style={{ textAlign: "center" }}>Create Post</Text>
                    </TouchableHighlight>



                    <StatusBar style="auto" />
                </View>
            </ImageBackground>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        color: "white"
    },
    tinyLogo: {
        width: 350,
        height: 200,
    },
    textInput: {
        width: "100%",
        borderColor: "white",
        margin: 5,
        padding: 20,
        borderWidth: 1,
        borderRadius: 20,
        color: "black",
        backgroundColor: "white"
    },
    button: {
        padding: 15,
        borderColor: "black",
        backgroundColor: "#00b8ff",
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 10,
        width: "100%",
    }
});
export default Add;
