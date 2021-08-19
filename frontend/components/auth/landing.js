import React from 'react'
import { View, Text, Button } from 'react-native'

const landing = ({navigation}) => {
    return (
        <View 
        style = {{flex:1, justifyContent:"center"}}
        >
            <Button
                title="register"
                onPress= {()=> navigation.navigate("Register")}
            />
            <Button
                title="Login"
                onPress= {()=> navigation.navigate("Login")}
            />

        </View>
    )
}

export default landing
