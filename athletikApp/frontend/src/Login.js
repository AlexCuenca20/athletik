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
                        onPress={() => this.props.navigation.navigate('Login')}
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