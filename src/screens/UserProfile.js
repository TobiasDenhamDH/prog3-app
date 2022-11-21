import React, { Component } from 'react'
import {  Text, View, TouchableOpacity,ScrollView, StyleSheet, Image , FlatList} from 'react-native';
import { db, auth } from '../firebase/config';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import Loader from '../components/Loader';
import Post from '../components/Post';
import NewPost from './NewPost';

export default class UserProfile extends Component {
    constructor(props) {
        super(props)
        this.state={
            loading:true,
            user: {},
            posts: [],
        }
    }


    componentDidMount() {

        db.collection('users')
        .where('userName', '==', this.props.route.params.userName)
        .onSnapshot((docs) => {
            let usersFromDb = {};
            docs.forEach((doc) => {
            let user = doc.data()
            console.log(user)
            usersFromDb = {
                id: doc.id,
                data: user,
            }
            })
            this.setState({ 
                user: usersFromDb, 
                loading:false
                })
        })

        db.collection('posts')
        .where('owner', '==', this.props.route.params.userName)
        .onSnapshot((docs)=>{
            let posts = [];
            docs.forEach(doc=>{
            posts.push( {
                id:doc.id, data:doc.data()})

    
        })

        this.setState({
            posts: posts,
   
          })
        })
  

       
    }

    render() {
        return (

                this.state.loading? <Loader/> :
                <ScrollView>
                   

                <View style={styles.container3}>
                    {this.state.user.data.image ?
                    <Image source={{uri: this.state.user.data.image}} style={styles.fotoPerfil}/>
                    :
                    <FontAwesome name="user-circle" size={40} color="black" />
                    }
                    <Text style={styles.text2}><strong>{this.state.user.data.userName}</strong></Text>
                </View>

                
                <View style={styles.container5}>
                    <Text style={styles.text3}>{this.state.user.data.email}</Text>                     
                    <Text style={styles.text3}>{this.state.user.data.bio}</Text>
                </View>
                    
                {this.state.posts.length?
                 <>  
                <View style={styles.container6}>
                    <Text style={styles.text}><strong> Posteos ({this.state.posts.length})</strong></Text>
                </View>

                    <View>
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <Post post={item} {...this.props} />}
                    /> 
                </View>
                </>

                :
                
                <View style={styles.container6}>
                <Text style={styles.text}><strong>Aún no tienes posteos</strong></Text>
                </View>
                
               
                }

                    
                    

                </ScrollView>
                           
        )
       
    }
}
const styles = StyleSheet.create({
button: {
    padding:8,
    backgroundColor: '#552586',
    borderRadius:8,
    textAlign:'center',
    marginVertical:4,
    marginHorizontal:16,
    width:200,
    color: "white"
},
add: {
    display:'flex',
    alignSelf:'center'
},
container4: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  
},
container6: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'left',
    
  
},
container3: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 6,
    paddingTop: 10,
    paddingBottom: 10
 },
 container5: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: 6,
    paddingBottom: 10
 },
 fotoPerfil: {
    height: 100,
    width: 100,
    borderRadius: 50
},
text: {
    fontSize: 25,
    color: 'black',
    marginHorizontal:6,
    marginBottom:10
},
text2: {
    fontSize: 35,
    color: 'black',
    alignSelf:'center',
    marginHorizontal:10,
    marginTop: 15,
  
},
text3: {
    fontSize: 15,
    color: 'black',
    marginHorizontal:6,
  
  
},

})