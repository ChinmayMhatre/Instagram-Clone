import React,{useEffect, useState} from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
const Profile = (props) => {
    
    
    const [user, setUser] = useState(null)
    const [userPosts, setUserPosts] = useState([])
    const [following, setFollowing] = useState(false)

    const onFollow = ()=>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }
    const onUnfollow = ()=>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    useEffect(() => {
        const { currentUser, posts} = props
        if(props.route.params.uid == firebase.auth().currentUser.uid){
            setUser(currentUser)
            setUserPosts(posts)
        }else{
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot)=>{
                if(snapshot.exists){
                    setUser(snapshot.data())
                }else{
                    console.log("does not exist");
                }
            })

            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot)=>{
                const posts = snapshot.docs.map(doc =>{
                    const data = doc.data()
                    const id   = doc.id
                    return {id , ...data}
                })
                console.log(posts);
                setUserPosts(posts)

            })
            
            if(props.following.indexOf(props.route.params.uid) > -1){
                setFollowing(true)
            }else{
                setFollowing(false)
            }

        }
    },[props.route.params.uid, props.following])

    if(!user){
        return <View/>
    }else{
        return (
            <View style={styles.container}>
                <View style={styles.infoContainer} >
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>

                    {
                        props.route.params.uid !== firebase.auth().currentUser.uid?
                        <View> 
                            {
                                following?(
                                    <Button
                                        title="Following"
                                        onPress={()=>onUnfollow()}
                                    />

                                ):(
                                    <Button
                                        title="Follow"
                                        onPress={()=>onFollow()}
                                    />
                                )
                            }
                        </View>
                        :null

                    }
                </View>
                <View style={styles.galleryContainer} >
                    <FlatList
                        horizontal={false}
                        numColumns={3}
                        data={userPosts}
                        renderItem={({item})=>(
                            <View style={{flex:1/3}}>
                                <Image
                                    source={{uri:item.downloadURL}}
                                    style={styles.image}
                                />
                            </View>
                        )}
                    /> 
                </View>
                
            </View>
        )
    }
    
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
    posts : store.userState.posts,
    following: store.userState.following
  })


export default connect(mapStateToProps,null)(Profile)

