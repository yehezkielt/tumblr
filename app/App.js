// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import client from './config/apollo';
import { ApolloProvider } from '@apollo/client';
import AuthContext from './context/auth';
import { useState } from 'react';
import * as SecureStorage from "expo-secure-store";
import Login from './screens/login'
import Register from './screens/register';
import Home from './screens/postCard';
import Search from './screens/Search';
import Profile from './screens/Profile';
import Add from './screens/AddPost';
import { Comments } from './screens/Comments';
import Follower from './screens/Follower';
import Following from './screens/Following';


const Stack = createNativeStackNavigator();
function App() {

    const [isSignedIn, setIsSignedIn] = useState(false);
    (async () => {
        const accessToken = await SecureStorage.getItemAsync("accessToken");
        if (accessToken) {
            setIsSignedIn(true);
        }
    })();


    return (

        <ApolloProvider client={client}>
            <NavigationContainer>
                <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
                    <Stack.Navigator>
                        {!isSignedIn ? (
                            <>

                                <Stack.Screen name="Login" component={Login} options={{ title: "Login", headerShown: false }} />

                                <Stack.Screen name="Register" component={Register} options={{ title: "Register", headerShown: false }} />

                            </>
                        ) : (
                            <>

                                <Stack.Screen name="Home" component={Home} options={{ title: 'Home', headerShown: false }} />

                                <Stack.Screen name="Search" component={Search} options={{ title: "Search", headerShown: false }} />

                                <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile", headerShown: false }} />

                                <Stack.Screen name="Add" component={Add} options={{ title: 'Add Post', headerShown: false }} />

                                <Stack.Screen name="Comments" component={Comments} options={{ title: 'Add Comments', headerShown: false }} />

                                <Stack.Screen name="Follower" component={Follower} options={{ title: 'Follower', headerShown: false }} />

                                <Stack.Screen name="Following" component={Following} options={{ title: 'Following', headerShown: false }} />
                            </>
                        )}
                    </Stack.Navigator>
                </AuthContext.Provider>
            </NavigationContainer>
        </ApolloProvider>
    );
}

export default App;