import React, { Component } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Button, Text } from '@rneui/themed';

export class LandingPage extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <Image style={styles.image} source={require('../assets/running.jpeg')} />
                    <View style={styles.titleContainer}>
                        <Text style={styles.titleText}>ATHLETIK</Text>
                    </View>
                    <View style={styles.subtitleContainer}>
                        <Text style={styles.subtitleText}>Keep Rolling!</Text>
                    </View>
                </View>
                <View style={styles.lowerContainer}>
                    <Button
                        buttonStyle={{ backgroundColor: '#000', justifyContent: 'space-between' }}
                        containerStyle={{ width: '90%' }}
                        title="EMPEZAR"
                        size='lg'
                        titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                        icon={{
                            name: 'long-arrow-right',
                            type: 'font-awesome',
                            size: 25,
                            color: 'white',
                        }}
                        iconRight
                        onPress={() => this.props.navigation.navigate('SignUp')}>
                    </Button>
                    <Button
                        title="¿YA TIENES UNA CUENTA? INICIA SESIÓN"
                        titleStyle={{
                            fontSize: 12,
                            fontWeight: 'bold',
                            textDecorationLine: 'underline',
                            color: '#000'
                        }}
                        containerStyle={{ paddingTop: 10 }}
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
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40
    },
    image: { width: '100%', height: '100%' },
    titleContainer: {
        position: 'absolute',
        top: -375,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subtitleContainer: {
        position: 'absolute',
        top: -280,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 70,
        fontWeight: 'bold',
        color: '#DAF7A6'
    },
    subtitleText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF'
    }
})