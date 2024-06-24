import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { BACKEND_URL } from '../config';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            username: '',
            email: '',
            password: '',
        };
    }

    setEmail(email) {
        this.setState({
            email: email
        })
    }

    setName(name) {
        this.setState({
            name: name
        })
    }

    setUsername(username) {
        this.setState({
            username: username
        })
    }

    setPassword(password) {
        this.setState({
            password: password
        })
    }

    _validateInputs() {
        return Object.values(this.state).every((input) => input !== '')
    }

    async registerUser() {
        fetch(BACKEND_URL + '/api/v1/users/',
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.state),
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    parsedTokenResponse = JSON.parse(await response.text());
                    await SecureStore.setItemAsync('secure_token', parsedTokenResponse.token);
                    await SecureStore.setItemAsync('email', parsedTokenResponse.user_info.email);
                    await SecureStore.setItemAsync('fullname', parsedTokenResponse.user_info.fullname);
                    await SecureStore.setItemAsync('username', parsedTokenResponse.user_info.username);
                    await SecureStore.setItemAsync('id', parsedTokenResponse.user_info.id.toString());

                    return;
                }
                throw new Error(JSON.parse(await response.text()).message);
            })
            .finally(() => {
                this.props.navigation.navigate('Home');
                return;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleSignUpPress() {
        if (this._validateInputs()) {
            this.registerUser();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Text style={styles.h1}>
                        Athletik
                    </Text>
                    <Text style={styles.h2}>
                        Registro
                    </Text>
                    <Text style={styles.h3}>
                        Introduce tus datos
                    </Text>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="NOMBRE"
                            onChangeText={(name) => this.setName(name)}
                            inputContainerStyle={styles.input}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="USUARIO"
                            onChangeText={(username) => this.setUsername(username)}
                            inputContainerStyle={styles.input}
                        />
                    </View>

                    <Divider style={{ margin: 10 }}></Divider>

                    <View style={styles.inputView}>
                        <Input
                            placeholder="EMAIL"
                            inputMode='email'
                            onChangeText={(email) => this.setEmail(email)}
                            inputContainerStyle={styles.input}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="CONTRASEÑA"
                            secureTextEntry={true}
                            onChangeText={(password) => this.setPassword(password)}
                            inputContainerStyle={styles.input}
                        />
                    </View>
                </View>
                <Divider></Divider>
                <View style={styles.lowerContainer}>
                    <Button
                        buttonStyle={{ backgroundColor: '#000', borderRadius: 10 }}
                        containerStyle={{ width: '90%' }}
                        title="ÚNETE"
                        size='lg'
                        titleStyle={{
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}
                        onPress={() => this.handleSignUpPress()}
                    >
                    </Button>
                </View>
            </View>
        )
    }
}

export default SignUp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    upperContainer: {
        flex: 10,
        width: '100%',
        paddingTop: 20,
        alignItems: 'center',
    },
    lowerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40
    },
    inputView: {
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10
    },
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8
    },
    h2: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 5
    },
    h3: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 30
    },
    input: {
        borderWidth: 1,  // size/width of the border
        borderColor: 'lightgrey',  // color of the border
        borderRadius: 10,
        paddingLeft: 10,
        height: 55,
    },
});