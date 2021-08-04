
import firebase from 'firebase'
import { USER_STATE_CHANGE, USER_POST_STATE_CHANGE,USER_FOLLOWING,USERS_POST_STATE_CHANGE, USERS_STATE_CHANGE, CLEAR_DATA } from '../constants'




export function clearData(){
    return (
        (dispatch)=>{
            dispatch({type:CLEAR_DATA})
        }
    )
}


export function fetchUser(){
    return (
        (dispatch) =>{
            firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot)=>{
                if(snapshot.exists){
                    dispatch({type:USER_STATE_CHANGE,currentUser:snapshot.data()})
                }else{
                    console.log("does not exist");
                }
            })
        }
    )
}



export function fetchUserPosts(){
    return (
        (dispatch) =>{
            firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot)=>{
                const posts = snapshot.docs.map(doc =>{
                    const data = doc.data()
                    const id   = doc.id
                    return {id , ...data}
                })
                // console.log(posts);
                dispatch({type:USER_POST_STATE_CHANGE,posts})

            })
        }
    )
}


export function fetchUserFollowing(){
    return (
        (dispatch) =>{
            firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot)=>{
                const following = snapshot.docs.map(doc =>{
                    const id   = doc.id
                    return id
                })
                dispatch({type:USER_FOLLOWING,following})
                for (let i=0 ; i<following.length ;i++){
                    // console.log(following)
                    dispatch(fetchUsersData(following[i]))
                }
            })
            
        }
    )
}


export function fetchUsersData(uid){
    return (
        (dispatch,getState) =>{
            const found = getState().usersState.users
            .some(el => el.uid === uid);
            if(!found){
                firebase.firestore()
                .collection("users")
                .doc(uid)
                .get()
                .then((snapshot)=>{
                    if(snapshot.exists){
                        const user = snapshot.data()
                        user.uid = uid
                        dispatch({type:USERS_STATE_CHANGE,user})
                        console.log("call hua")
                        dispatch(fetchUserFollowingPosts(user.uid))
                    }else{
                        console.log("does not exist");
                    }
                })
            }
            
        }
    )
}


export function fetchUserFollowingPosts(uid){
    return (
        (dispatch,getState) =>{
            firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot)=>{
                try {
                    const uid = snapshot.query._.C_.path.segments[1]
                    const user = getState().usersState.users.find(el => el.uid === uid);
                    console.log(user)
                    const posts = snapshot.docs.map(doc =>{
                        const data = doc.data()
                        const id   = doc.id
                        return {id , ...data, user}
                    })
                    dispatch({type:USERS_POST_STATE_CHANGE,posts,uid})
                    // console.log(getState())
                } catch (error) {
                    console.log(error)
                }
                
            })
        }
    )
}