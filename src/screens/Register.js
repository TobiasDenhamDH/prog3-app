import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Image } from 'react-native';
import { auth, db, storage} from '../firebase/config';
// import {getStorage, ref, uploadBytes} from '../firebase/config/storage'
import * as ImagePicker from 'expo-image-picker';
import Loader from '../components/Loader';


export default class Register extends Component {

    constructor(props){
        super(props)
        this.state={
            loading: true,
            email:'',
            pass:'',
            userName:'',
            bio: '',
            error: {
                email:'',
                userName:'',
                pass:''
            },
            image: '',
            permission: true
        }
    }

    componentDidMount(){
        // ImagePicker.getMediaLibraryPermissionsAsync()
        // .then(()=>this.setState({
        //     permission:true
        // }))
        // .catch(err=>console.log(err))

            this.setState({
                loading:false
            })
        
        }

           

    register(email,pass,userName,bio, image){

        if (this.state.userName.length == 0 && this.state.email.length == 0  && this.state.pass.length == 0){
            this.setState({error: {email:'ingrese email', userName:'ingrese nombre', pass: 'ingrese contraseña'}})
            return

        }else if(this.state.userName.length == 0 && this.state.email.length == 0 ) {
            this.setState({error: {email:'ingrese email', userName:'ingrese nombre', pass:''}})
            return

        }else if (this.state.userName.length == 0 && this.state.pass.length == 0 ){
            this.setState({error: {email:'', userName:'ingrese nombre', pass:'ingrese contraseña'}})
            return

        } else if (this.state.email.length == 0 && this.state.pass.length == 0 ){
            this.setState({error: {email:'ingrese email', userName:'', pass:'ingrese contraseña'}})
            return

        } else if (this.state.email.length == 0){
            this.setState({error: {email:'ingrese email', userName:'', pass:''}})
            return

        } else if (this.state.pass.length == 0 ){
            this.setState({error: {email:'', userName:'', pass:'ingrese contraseña'}})
            return

        } else if (this.state.userName.length == 0){
            this.setState({error: {email:'', userName:'ingrese nombre', pass:''}})
            return
        }

        this.setState({error:{email:'', userName:'', pass:''}})

        // let getStorage = getStorage()
        // let imagePerfil = ref(getStorage, this.state.image)
        // let imageRef = ref(getStorage,`fotoperfil/${Date.now()}.jpg`)

        // uploadBytes(imageRef,imagePerfil).then((snapshot)=>{
        //     console.log('se subio el archivo')
        // }
        // )
        
        auth.createUserWithEmailAndPassword(email,pass)
        .then((res)=> {

            db.collection('users').add({
                email:email,
                userName:userName,
                bio:bio,
                posts:[],
                image: image
            })
            console.log(res)
            res.user.updateProfile({
                displayName: userName,
              })

            this.setState({
                email:'',
                pass:'',
                userName:'',
                bio:'',
                image:''
            })
            this.props.navigation.navigate('Login')
        })
        .catch(err=>{
            this.setState({
                errorMensaje: err.message
            })
        })
    }

    elegirImagen(){

        let image = ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })
        .then((res) => {
            if (!image.cancelled) {
                this.setState({image: image.uri})
            }
            console.log(this.state.image)
        })
    }
    
    render() {
        return (
            this.state.loading ? <Loader/> : 

            <View style={styles.container}>
                    
                <Text style={styles.text}><strong>Registro</strong></Text>
                <View>

                    <TextInput
                            style={styles.campo}
                            keyboardType='default'
                            placeholder='Nombre de usuario'
                            onChangeText={userName=>this.setState({userName:userName})}
                            value={this.state.userName}

                        />
                        <Text style={styles.errorText}>
                        {this.state.error.userName && 'El nombre de usuario es obligatorio'}
                        </Text>
                    <TextInput
                            style={styles.campo}
                            keyboardType='default'
                            placeholder='Biografía'
                            onChangeText={bio=>this.setState({bio:bio})}
                            value={this.state.bio}
                    />
                    <TextInput
                        style={styles.campo}
                        keyboardType='email-address'
                        placeholder='Dirección de email'
                        onChangeText={userEmail=>this.setState({email:userEmail})}
                        value={this.state.email}

                    />
                    <Text style={styles.errorText}>
                    {this.state.error.email && 'La dirección de email es obligatoria'}
                    </Text>
                    <TextInput
                        style={styles.campo}
                        keyboardType='default'
                        placeholder='Contraseña'
                        secureTextEntry
                        onChangeText={userPass=>this.setState({pass:userPass})}
                        value={this.state.pass}

                    />
                    <Text style={styles.errorText}>
                    {this.state.error.pass && 'La contraseña es obligatoria'}
                    </Text>
                    <Text style={styles.errorText}>{this.state.errorMensaje}</Text>
                    {this.state.permission &&
                    <Button 
                        style={styles.campo}
                        title= 'Elegí tu foto de perfil'
                        onPress={()=>{this.elegirImagen()}}
                    >
                    {this.state.image && <Image source={{uri: this.state.image}} style={{width: 200, height: 200}}/>}
                    </Button>
    }
                </View>

                {this.state.email.length == 0 || this.state.pass.length == 0 || this.state.userName.length == 0?

                <TouchableOpacity 
                    onPress={()=>{this.register(this.state.email, this.state.pass, this.state.userName, this.state.bio)}}
                    
                    style={styles.button2}
                >
                    <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>
                :
                <TouchableOpacity 
                    onPress={()=>{this.register(this.state.email, this.state.pass, this.state.userName, this.state.bio, this.state.image)}}
                    
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Registrarme</Text>
                </TouchableOpacity>

                }

                <TouchableOpacity 
                    onPress={()=>{this.props.navigation.navigate("Login")}}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Ya tengo cuenta</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

const styles = StyleSheet.create({

    container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    },
    campo: {
        fontSize:16,
        borderColor: '#552586',
        borderWidth:1,
        borderStyle:'solid',
        borderRadius:4,
        marginVertical:8,
        marginHorizontal:16,
        padding:8,
        width:280
    },
    errorText: {
        color: 'red',
        marginHorizontal:16,
        maxWidth: 280
    },

    button: {
        padding:8,
        backgroundColor: '#552586',
        borderRadius:8,
        textAlign:'center',
        marginVertical:8,
        marginHorizontal:16,
        width:280
    },
    button2: {
        padding:8,
        backgroundColor: 'grey',
        borderRadius:8,
        textAlign:'center',
        marginVertical:8,
        marginHorizontal:16,
        width:280
    },

    buttonText: {
        fontSize:24,
        color:'#FAFAFA',
    },

    text: {
        fontSize: 30,
        color: 'black',
        marginHorizontal:16,
        marginBottom:10
    }
})