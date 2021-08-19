import React,{useEffect, useState} from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
const Feed = (props) => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        console.log(props.userFollowingLoaded)
        if(props.userFollowingLoaded === props.following.length  && props.following.length !== 0){
            props.feed.sort(function(x,y){
                return x.creation - y.creation;
            })
            setPosts(props.feed)
        }
    },[props.userFollowingLoaded, props.feed])

    const onLikePress = (userId,postId) =>{
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (userId,postId) =>{
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

        return (
            <View style={styles.container}>
                <View style={styles.galleryContainer} >
                    
                    <FlatList
                        horizontal={false}
                        numColumns={1}
                        data={posts}
                        renderItem={({item})=>(
                            <View style={{flex:1/3}}>
                            <Text style={{flex:1}}>{item.user.name}</Text>
                                <Image
                                    source={{uri:item.downloadURL}}
                                    style={styles.image}
                                />
                            {item.currentUserLike?
                                (
                                    <Button
                                        title="Dislike"
                                        onPress={()=>onDislikePress(item.user.uid,item.id)}
                                    />
                                ):
                                (
                                    <Button
                                        title="Like"
                                        onPress={()=>onLikePress(item.user.uid,item.id)}
                                    />
                                )
                            }    
                            <Text 
                                onPress={()=>props.navigation.navigate("Comments",{postId:item.id,uid: item.user.uid})}
                            >
                                View Comments
                            </Text>
                            </View>
                        )}
                    /> 
                </View>
                
            </View>
        )
    }
    


const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:40
    },
    infoContainer:{
        margin:20
    },
    image:{
        flex:1,
        aspectRatio:1/1
    }
})

const mapStateToProps = (store) => ({
    currentUser : store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    userFollowingLoaded : store.usersState.userFollowingLoaded
})


export default connect(mapStateToProps,null)(Feed)

