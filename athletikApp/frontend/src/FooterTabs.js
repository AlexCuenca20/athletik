import React, { Component } from 'react'
import { Button } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';

export class FooterTabs extends Component {
    constructor() {
        super();
        this.state = {
            index: 0
        }
    }

    setIndex(index) {
        this.setState({
            index: index
        })
    }

    handleActivityPress() {
        return this.props.navigation.navigate('Activity');
    }

    render() {
        return (
            <View style={styles.container}>
                <Button
                    buttonStyle={{ backgroundColor: '#000', height: '100%' }}
                    containerStyle={{ width: '25%' }}
                    title="Inicio"
                    titleStyle={{
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleActivityPress()}
                >
                </Button>
                <Button
                    buttonStyle={{ backgroundColor: '#000', height: '100%' }}
                    containerStyle={{ width: '25%' }}
                    title="Actividad"
                    titleStyle={{
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleActivityPress()}
                >
                </Button>
                <Button
                    buttonStyle={{ backgroundColor: '#000', height: '100%' }}
                    containerStyle={{ width: '25%' }}
                    title="Perfil"
                    titleStyle={{
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleActivityPress()}
                >
                </Button>
                <Button
                    buttonStyle={{ backgroundColor: '#000', height: '100%' }}
                    containerStyle={{ width: '25%' }}
                    title="Mis Actividades"
                    titleStyle={{
                        fontSize: 12,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleActivityPress()}
                >
                </Button>
            </View >
        )
    }
}

export default FooterTabs

const styles = StyleSheet.create({
    container: {
        flex: 2,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        backgroundColor: '#aaa',
    }
});