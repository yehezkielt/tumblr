import { useContext, useState } from "react";
import { ActivityIndicator, Alert, Image, ImageBackground, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { gql, useMutation } from "@apollo/client";
import AuthContext from "../context/auth";
import * as SecureStore from "expo-secure-store";



const LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`;

export default function Login({ navigation }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const { setIsSignedIn } = useContext(AuthContext);
    const [passwordVisible, setPasswordVisible] = useState(false);



    const [login, { error, loading, data }] = useMutation(LOGIN, {
        onCompleted: async (data) => {
            await SecureStore.setItemAsync("accessToken", data?.login.accessToken);
            setIsSignedIn(true);
        },
    });

    const handleLogin = async () => {
        try {
            await login({
                variables: { username, password },
            });
            Alert.alert("Login Successfull");
            navigation.navigate("Search")
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
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

                    <TextInput onChangeText={setUsername} placeholder='Username..' style={styles.textInput} />

                    <TextInput onChangeText={setPassword} value={password} placeholder='Password..' secureTextEntry={!passwordVisible} style={styles.textInput} />


                    <TouchableHighlight style={styles.button} onPress={handleLogin}>
                        <Text style={{ textAlign: "center" }}>Login</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={{}} onPress={() => navigation.navigate('Register')}>
                        <Text style={{ textAlign: "center", color: "white" }}>Go to Register..</Text>
                    </TouchableHighlight>

                    <StatusBar style="auto" />
                </View>
            </ImageBackground>
        </>
    )
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