import React,{useState, useEffect} from 'react'
import { View, Text, FlatList, Button, TextInput } from 'react-native'

import firebase from 'firebase'
require("firebase/firestore")
import { connect } from 'react-redux'
import { fetchUsersData } from '../../redux/actions'
import { bindActionCreators } from 'redux'

const Comments = (props) => {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

    const onCommentSend = ()=>{
        firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(props.route.params.postId)
            .collection("comments")
            .add({
                creator : firebase.auth().currentUser.uid,
                text
            })
    }

    useEffect(() => {
        function matchUserToComments(comments){
            for(let i=0 ; i< comments.length; i++){
                const user = props.users.find(x=> x.uid === comments[i].creator)
                if(comments[i].hasOwnProperty("user")){
                    continue;
                }
                if(user == undefined){
                    props.fetchUsersData(comments[i].creator,false)
                }else{
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        if(props.route.params.postId !== postId){
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(props.route.params.postId)
            .collection("comments")
            .get()
            .then((snapshot)=>{
                let comments = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id,...data}
                })

                matchUserToComments(comments)
            })
            setPostId(props.route.params.postId)
        }else{
            matchUserToComments(comments)
        }
    }, [props.route.params.postId,props.users])

    return (
        <View>
            <FlatList
                numColumns={1}
                horizontal={false}
                data = {comments}
                renderItem={({item})=>(
                    <View>
                        <Text>
                            {item.user !== undefined ? 
                                <Text>
                                    {item.user.name}
                                </Text>
                                : null}
                            {item.text}
                        </Text>
                    </View>
                )}
            />
            <View>
                <TextInput
                    placeholder="Comment..."
                    onChangeText={(text)=> setText(text)}

                />
                <Button
                    onPress={()=>onCommentSend()}
                    title="Send"
                />
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    users : store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUsersData},dispatch)
export default connect(mapStateToProps,mapDispatchProps)(Comments)


