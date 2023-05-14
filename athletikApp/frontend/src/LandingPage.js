import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Button } from '@rneui/themed';

export class LandingPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Image style={styles.image} source={require('../assets/logo.png')} />
                </View>
                <View style={styles.lowerContainer}>
                    <Button
                        buttonStyle={{ backgroundColor: '#000' }}
                        containerStyle={{ width: '90%' }}
                        title="EMPEZAR"
                        titleStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        icon={{
                            name: 'arrow-right',
                            type: 'font-awesome',
                            size: 15,
                            color: 'white',
                        }}
                        iconRight
                        onPress={() => this.props.navigation.navigate('SignUp')}>
                    </Button>
                    <Button
                        title="¿YA TIENES UNA CUENTA? INICIA SESIÓN"
                        titleStyle={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textDecorationLine: 'underline',
                            color: '#000'
                        }}
                        type="clear"
                        onPress={() => this.props.navigation.navigate('Login')}
                    >
                    </Button>
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#aaa',
    },
    lowerContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: { width: 220, height: 220 },
})