import React,{useState} from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import firebase from 'firebase'
const Search = (props) => {
    const [users, setUsers] = useState([])
    
    const fetchUsers = (search) => {
        firebase.firestore()
        .collection("users")
        .where('name', '>=', search)
        .get()
        .then((snapshot) => {
            const usersdata = snapshot.docs.map(doc =>{
                const data = doc.data()
                const id   = doc.id
                return {id , ...data} 
            })
           
            setUsers(usersdata)    
            console.log(users)
        })
    }
    
    return (
        <View>
            <TextInput placeholder= "enter user" onChangeText={(search)=>fetchUsers(search)} />

            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) =>(
                    <TouchableOpacity
                        onPress={()=> props.navigation.navigate('Profile', {uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    
                )}
            />

            
        </View>
    )
}

export default Search
