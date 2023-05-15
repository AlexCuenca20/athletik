import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: ''
        };
    }

    setEmail(email) {
        this.setState({
            email: email
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
            fetch('http://127.0.0.1:8000/api/v1/users/?username=' + this.state.email + '?password=' + this.state.password,
                {
                    method: "GET",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Something went wrong');
                })
                .then((responseJson) => {
                    alert('iniciadoo!!');
                    this.props.navigation.navigate('LandingPage');
                    return responseJson;
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
}

render() {
    return (
        <View style={styles.container}>
            <View style={styles.upperContainer}>
                <View style={styles.inputView}>
                    <Input
                        placeholder="EMAIL"
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
                    title="INICIAR SESIÓN"
                    titleStyle={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleLoginPress()}
                >
                </Button>
            </View>
        </View>
    )
}


export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    upperContainer: {
        flex: 8,
        width: '100%',
        alignItems: 'center',
        paddingTop: 40,
    },
    lowerContainer: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});