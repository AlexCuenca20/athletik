import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
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
                    <View style={styles.inputView}>
                        <Input
                            placeholder="USUARIO"
                            onChangeText={(username) => this.setUsername(username)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="CONTRASEÑA"
                            secureTextEntry={true}
                            onChangeText={(password) => this.setPassword(password)}
                        />
                    </View>
                </View>
                <Divider></Divider>
                <View style={styles.lowerContainer}>
                    <Button
                        buttonStyle={{ backgroundColor: '#000' }}
                        containerStyle={{ width: '90%' }}
                        size='lg'
                        title="INICIAR SESIÓN"
                        titleStyle={{
                            fontSize: 14,
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
        paddingTop: 40,
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
    }
});