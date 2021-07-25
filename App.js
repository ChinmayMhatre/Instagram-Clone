import React,{Component} from 'react';
import { StyleSheet, Text, View,SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from "firebase"

import Landing from "./components/auth/landing"
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import Main from './components/Main'
import SaveScreen from './components/main/Save'

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk';
import { LogBox } from 'react-native';
import AddScreen from './components/main/Add'

LogBox.ignoreLogs(['Setting a timer']);

const store = createStore(rootReducer,applyMiddleware(thunk))



if (firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}


export class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded:false,
      loggedIn:false
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true
        })
      }else{
        this.setState({
          loggedIn:true,
          loaded:true
        })
      }
    })
  }

  render() {

    const Stack = createStackNavigator();
    const {loggedIn, loaded} = this.state
    if(!loaded){
      return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator
          initialRouteName="Landing"
          >
            <Stack.Screen name="Landing" component={Landing} options={{headerShown:false}} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      
   
    );
    }
    return(
      <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          >
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Add" component={AddScreen}/>
            <Stack.Screen name="Save" component={SaveScreen}/>

          </Stack.Navigator>
      </NavigationContainer>    
      </Provider>
      
    )
  }
}

export default App




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
