import React, { Component } from 'react'
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'
import firebase from 'firebase'
import {
    View,
    Text
} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing } from '../redux/actions'
import Feed from './main/Feed';

const emptyScreen = ()=>{
  return(null)
}

export class Main extends Component {
  componentDidMount(){
    this.props.fetchUser()
    this.props.fetchUserPosts()
    this.props.fetchUserFollowing()
  }

    render() {
      const Tab = createBottomTabNavigator();
        return (
          <Tab.Navigator
          tabBarOptions={{
            style:{
              backgroundColor:"#000"
            },
            activeTintColor:"#fff",
            inactiveTintColor:"grey"
          
          }}
          initialRouteName="Feed"
        
          >
            <Tab.Screen 
            name="Feed" 
            component={FeedScreen}
            options={{
              tabBarIcon:({color,size})=>(
                <MaterialCommunityIcons name = "home" color={color} size = {32}/>
              ),
              tabBarLabel: ()=> null
            }}
             />
            <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              tabBarIcon:({color,size})=>(
                <MaterialCommunityIcons name = "magnify" color={color} size = {32}/>
              ),
              tabBarLabel: ()=> null
            }}
             />
            <Tab.Screen 
            name="AddButton" 
            component={emptyScreen}
            listeners={({navigation})=>({
              tabPress:event=>{
                event.preventDefault();
                navigation.navigate("Add")
              }
            })}
            options={{
              tabBarIcon:({color,size})=>(
                <MaterialCommunityIcons name = "plus-circle-outline" color={color} size = {32}/>
              ),
              tabBarLabel: ()=> null
            }}
             />
            <Tab.Screen 
            name="Profile" 
            listeners={({navigation})=>({
              tabPress:event=>{
                event.preventDefault();
                navigation.navigate("Profile",{uid:firebase.auth().currentUser.uid})
              }
            })}
            component={ProfileScreen}
            options={{
              tabBarIcon:({color,size})=>(
                <MaterialCommunityIcons name = "account-circle" color={color} size = {32}/>
              ),
              tabBarLabel: ()=> null
            }}
             />
          </Tab.Navigator>
        )  
    }
}


const mapStateToProps = (store) => ({
  currentUser : store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPosts, fetchUserFollowing},dispatch)

export default connect(mapStateToProps,mapDispatchProps)(Main)
