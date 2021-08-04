import React,{useEffect, useState} from 'react'
import { View, Text, Image, FlatList, StyleSheet, Button } from 'react-native'
import { connect } from 'react-redux'
import firebase from 'firebase'
const Profile = (props) => {
    
    
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])

    useEffect(() => {
       let posts = []
    //    console.log(props.userLoaded)
        if(props.userLoaded === props.following.length  && props.following.length !== 0){
            

            for(let i = 0 ; i< props.following.length; i++){
                const user = props.users.find(el=>el.uid=== props.following[i])
                
                if(user != undefined){
                    posts = [...posts , ...user.posts]
                }
            }
            posts.sort(function(x,y){
                return x.creation - y.creation;
            })
            // console.log(posts)
            setPosts(posts)
        }
    },[props.userLoaded])

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
    users : store.usersState.users,
    userLoaded : store.usersState.userLoaded
  })


export default connect(mapStateToProps,null)(Profile)

