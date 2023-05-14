import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native'

export class LandingPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Image style={styles.image} source={require('../assets/logo.png')} />
                </View>
                <View style={styles.lowerContainer}>
                    <TouchableOpacity style={styles.signUpBtn}>
                        <Text style={styles.signUpText}>EMPEZAR</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => this.props.navigation.navigate('Login')}
                    >
                        <Text style={styles.loginText}>¿YA TIENES UNA CUENTA? INICIA SESIÓN</Text>
                    </TouchableOpacity>
                </View>
            </View >

        )
    }
}

export default LandingPage

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
        justifyContent: 'center',
        backgroundColor: '#aaa',
    },
    lowerContainer: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: { width: 220, height: 220 },
    signUpBtn: {
        width: "90%",
        height: 40,
        margin: 5,
        backgroundColor: "#DAF7A6",
        justifyContent: "center",
        backgroundColor: '#000'
    },
    loginBtn: {
        width: "90%",
        height: 40,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    loginText: {
        margin: 5,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        fontSize: '10px',
        textDecorationLine: 'underline'
    },
    signUpText: {
        margin: 5,
        marginLeft: 15,
        fontFamily: 'Helvetica',
        fontWeight: 'bold',
        fontSize: '12px',
        color: '#fff'
    },
})