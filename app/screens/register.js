import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, ImageBackground, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";



const REGISTER = gql`
  mutation Register(
    $name: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      name
      username
      email
      password
    }
  }
`;

export default function Register({ navigation }) {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [register, { error, loading, data }] = useMutation(REGISTER);


    const handleRegister = async () => {
        try {
            await register({
                variables: {
                    name,
                    username,
                    email,
                    password,
                },
            });
            navigation.navigate("Login");
            Alert.alert("Registration Successfully");
        } catch (error) {
            console.log(error);
            Alert.alert("Error Registering", error.message);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator
                    size="large" />
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


                    <TextInput onChangeText={setUsername} value={username} placeholder='Username..' style={styles.textInput} />


                    <TextInput onChangeText={setName} value={name} placeholder='Name..' style={styles.textInput} />


                    <TextInput onChangeText={setEmail} value={email} placeholder='Email..' style={styles.textInput} />


                    <TextInput onChangeText={setPassword} value={password} placeholder='Password..' secureTextEntry={!passwordVisible} style={styles.textInput} />


                    <TouchableHighlight style={styles.button} onPress={handleRegister}>
                        <Text style={{ textAlign: "center" }}>Register</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={{}} onPress={() => navigation.navigate('Login')}>
                        <Text style={{ textAlign: "center", color: "white" }}>Go to Login..</Text>
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