import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input, Button, Divider } from '@rneui/themed';
import { BACKEND_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

class ModifyProfileForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.route.params.userInfo,
            inputEmail: '',
            inputUsername: '',
            inputFullname: '',
        };
    }

    setEmail(email) {
        this.setState({
            inputEmail: email
        })
    }

    setName(name) {
        this.setState({
            inputFullname: name
        })
    }

    setUsername(username) {
        this.setState({
            inputUsername: username
        })
    }

    _validateInputs() {
        return Object.values(this.state).every((input) => input !== '')
    }

    async modifyUser() {
        token = await SecureStore.getItemAsync('secure_token');

        const requestBody = {
            username: this.state.inputUsername,
            fullname: this.state.inputFullname,
            email: this.state.inputEmail,
        };

        fetch(BACKEND_URL + '/api/v1/users/',
            {
                method: "PUT",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token,
                },
                body: JSON.stringify(requestBody),
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    parsedTokenResponse = JSON.parse(await response.text());
                    this.props.navigation.navigate('ProfileDetails');

                    return;
                }
                throw new Error(JSON.parse(await response.text()).message);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleModifyPress() {
        if (this._validateInputs()) {
            this.modifyUser();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <View style={styles.inputView}>
                        <Input
                            label="Nombre"
                            placeholder={this.state.fullname}
                            onChangeText={(name) => this.setName(name)}
                            inputContainerStyle={styles.input}
                        />
                    </View>
                    <View style={styles.inputView}>
                        <Input
                            label="Usuario"
                            placeholder={this.state.username}
                            onChangeText={(username) => this.setUsername(username)}
                            inputContainerStyle={styles.input}
                        />
                    </View>

                    <View style={styles.inputView}>
                        <Input
                            label="Email"
                            placeholder={this.state.email}
                            inputMode='email'
                            onChangeText={(email) => this.setEmail(email)}
                            inputContainerStyle={styles.input}
                        />
                    </View>
                </View>
                <Divider></Divider>
                <View style={styles.lowerContainer}>
                    <Button
                        buttonStyle={{ backgroundColor: '#000', borderRadius: 10 }}
                        containerStyle={{ width: '100%' }}
                        title="MODIFICAR"
                        size='lg'
                        titleStyle={{
                            fontSize: 16,
                            fontWeight: 'bold',
                        }}
                        onPress={() => this.handleModifyPress()}
                    >
                    </Button>
                </View>
            </View>
        )
    }
}

export default ModifyProfileForm;

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
        padding: 10
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