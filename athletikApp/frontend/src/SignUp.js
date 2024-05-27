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
                    <View style={styles.inputView}>
                        <Input
                            placeholder="NOMBRE"
                            onChangeText={(name) => this.setName(name)}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Input
                            placeholder="USUARIO"
                            onChangeText={(username) => this.setUsername(username)}
                        />
                    </View>

                    <Divider style={{ margin: 20 }}></Divider>

                    <View style={styles.inputView}>
                        <Input
                            placeholder="EMAIL"
                            inputMode='email'
                            onChangeText={(email) => this.setEmail(email)}
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
                        title="ÚNETE"
                        size='lg'
                        titleStyle={{
                            fontSize: 14,
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
    },
    lowerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40
    },
});