import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';
import { BACKEND_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: ''
        };
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

    handleLoginPress() {
        if (this._validateInputs()) {
            fetch(BACKEND_URL + '/api/v1/token-auth/',
                {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: this.state.username, password: this.state.password }),
                }
            )
                .then(async (tokenResponse) => {
                    if (tokenResponse.ok) {
                        parsedTokenResponse = JSON.parse(await tokenResponse.text());
                        await SecureStore.setItemAsync('secure_token', parsedTokenResponse.token);

                        fetch(BACKEND_URL + '/api/v1/users/',
                            {
                                method: "GET",
                                mode: "cors",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": "Token " + parsedTokenResponse.token,
                                },
                            }
                        )
                            .then(async (loginResponse) => {
                                if (loginResponse.ok) {
                                    this.props.navigation.navigate('Home');
                                    return;
                                }
                                throw new Error(JSON.parse(await loginResponse.text()).message);
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        return;
                    }
                    throw new Error(JSON.parse(await tokenResponse.text()).message);
                })
                .catch((error) => {
                    console.log(error);
                });
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
                        Iniciar Sesión
                    </Text>
                    <Text style={styles.h3}>
                        Introduce tu usuario y contraseña
                    </Text>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="Usuario"
                            onChangeText={(username) => this.setUsername(username)}
                            inputContainerStyle={{
                                borderWidth: 1,  // size/width of the border
                                borderColor: 'lightgrey',  // color of the border
                                borderRadius: 10,
                                paddingLeft: 10,
                                height: 55,
                            }}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="Contraseña"
                            secureTextEntry={true}
                            onChangeText={(password) => this.setPassword(password)}
                            inputContainerStyle={{
                                borderWidth: 1,  // size/width of the border
                                borderColor: 'lightgrey',  // color of the border
                                borderRadius: 10,
                                paddingLeft: 10,
                                height: 55,
                            }}
                        />
                    </View>
                </View>
                <Divider></Divider>
                <View style={styles.lowerContainer}>
                    <Button
                        buttonStyle={{ backgroundColor: '#000', borderRadius: 10 }}
                        containerStyle={{ width: '90%' }}
                        size='lg'
                        title="Entrar"
                        titleStyle={{
                            fontSize: 18,
                            fontWeight: 'bold'
                        }}
                        onPress={() => this.handleLoginPress()}
                    >
                    </Button>
                </View>
            </View>
        )
    }
}

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    upperContainer: {
        flex: 10,
        width: '100%',
        alignItems: 'center',
        paddingTop: 10,
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
});