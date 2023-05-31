import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import FooterTabs from './FooterTabs';

export class HomePage extends Component {
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

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                </View>
            </View >
        )
    }
}

export default HomePage

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
});