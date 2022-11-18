import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons'; 
import { auth, db } from '../firebase/config'
import firebase from 'firebase'

export default class Post extends Component  {

    constructor(props){
        super(props)
        this.state={
            likes: [],
            comments:[],
            uri:''
        }
    }

    componentDidMount(){
        this.setState({
            likes: this.props.post.data.likes || [],
        })
    }

    borrarLikes() {
        db.collection('posts').doc(this.props.post.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.displayName)
        })
        .then((res) => {
            this.setState({
                likes:this.props.post.data.likes
            })
        })
        .catch(err => console.log(err))
    }

    likear(){
        db.collection('posts').doc(this.props.post.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.displayName)
        })
        .then((res) => {
            this.setState({
                likes:this.props.post.data.likes
            })
        })
        .catch(err => console.log(err))
    }

    render() {
    
    return (
        <>
            <View style={styles.container}>
                <View style={styles.container3}>
                {this.props.post.data.ownerPic ?
                        <Image source={{uri: this.props.post.data.ownerPic}} style={styles.fotoPerfil}/>
                    :
                        <FontAwesome name="user-circle" size={40} color="black" />
                }

                <Text style={styles.text2}><strong>{this.props.post.data.owner}</strong></Text>
                </View>

                <Image 
                    source={{uri:this.props.post.data.uri}}
                    resizeMode="contain"
                    style={styles.image}
                
                />

                {this.state.likes.includes(auth.currentUser.displayName)?
                <View style={styles.container2}>
                    <TouchableOpacity 
                        onPress={(borrarLike)=>{this.borrarLikes(borrarLike)}}
                      
                    >
                    <AntDesign name="heart" size={24} color="#552586" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                     style={styles.comment}
                    onPress={()=>{this.props.navigation.navigate('Comments', {id: this.props.post.id})}}

                    >
                    <FontAwesome name="comment-o" size={24} color="black" />
                    </TouchableOpacity>

                </View>

                :

                <View style={styles.container2}>
                    <TouchableOpacity 
                        onPress={(like)=>{this.likear(like)}}
                        
                    >
                    
                    <AntDesign name="hearto" size={24} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={styles.comment}
                    onPress={()=>{this.props.navigation.navigate('Comments', {id: this.props.post.id})}}

                    >
                    <FontAwesome name="comment-o" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                }

                <Text style={styles.text}><strong>{this.props.post.data.owner}</strong> {this.props.post.data.description}</Text>
                
                {!this.state.likes.length?             
                <Text style={styles.text} >No hay likes</Text>          
                : this.state.likes.length == 1?              
                <Text style={styles.text} >Le gusta a {this.state.likes.slice(-1)} </Text>             
                :
                <Text style={styles.text} >Le gusta a {this.state.likes.slice(-1)} {} y {this.state.likes.length -1} más</Text>
            }

            {!this.props.post.data.comments.length?
               
            <Text style={styles.text} >No hay comentarios</Text>

            : this.props.post.data.comments.length == 1?     
            
            <TouchableOpacity 
                onPress={()=>{this.props.navigation.navigate('Comments', {id: this.props.post.id})}}
            >
            <Text style={styles.text}>Ver el comentario</Text> 
            </TouchableOpacity>

            :
            <TouchableOpacity 
                onPress={()=>{this.props.navigation.navigate('Comments', {id: this.props.post.id})}}
            >
            <Text style={styles.text} >Ver los {this.props.post.data.comments.length} comentarios</Text>
            </TouchableOpacity>
            }    
            </View>
        </>
    )
}
}
const styles = StyleSheet.create({

    container: {
        padding:0,
        textAlign:'left',
    },
    container2: {
        display: 'flex',
        flexDirection:'row',
        marginHorizontal:6,
        paddingLeft: 2,
        paddingTop: 10, 
    },
    container3: {
       display: 'flex',
       flexDirection: 'row',
       marginHorizontal: 6,
       paddingTop: 10,
       paddingBottom: 10
    },
    comment: {
        marginLeft: 10
    },
    image: {
        height:250,
        padding:0
    },
    icon: {
        height: 20
    },
    text: {
        color: 'black',
        marginHorizontal:6,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 2
    },
    text2: {
        color: 'black',
        marginHorizontal:6,
        marginTop: 15,
      
    },
    fotoPerfil: {
        height: 40,
        width: 40,
        borderRadius: 50
    } 
})