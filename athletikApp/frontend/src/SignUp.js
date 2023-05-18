import React, { Component } from 'react';
import { Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';

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
        fetch('http://192.168.1.144:8000/api/v1/users/',
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.state),
            }
        )
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong');
            })
            .then((responseJson) => {
                alert('registrado!!');
                this.props.navigation.navigate('HomePage');
                return responseJson;
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
                        titleStyle={{
                            fontSize: 12,
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
        flex: 8,
        width: '100%',
        paddingTop: 20,
    },
    lowerContainer: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});