import React,{useState} from 'react'
import { View, Text,TextInput, Image, Button } from 'react-native'
import firebase from 'firebase';
require("firebase/firebase-storage")
require("firebase/firestore")



const Save = (props,{navigation}) => {
    console.log(props.route.params.image)
    const [caption, setCaption] = useState("")
    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
        console.log(childPath)
    
        const response = await fetch(uri);
        const blob = await response.blob();
    
        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        const taskCompleted = () => {
            console.log("hello");
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                SavePostData(snapshot)
                console.log(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }
        task.on('state_changed', taskProgress, taskError, taskCompleted)
    }

    const SavePostData = (downloadURL) => {
        firebase.firestore()
        .collection('posts')
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .add({
            downloadURL,
            caption,
            creation : firebase.firestore.FieldValue.serverTimestamp()
        }).then(function(){
            props.navigation.popToTop()
        })
    }
    return (
        <View style={{flex:1}}>
            <Image style={{flex:1}} source={{uri:props.route.params.image}}/>
            <TextInput
                placeholder="Write a caption.."
                onChangeText={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={uploadImage}/>
        </View>
        

        
    )
}

export default Save



