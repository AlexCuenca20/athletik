import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import FooterTabs from './FooterTabs';

export class Activity extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                </View>
                <View style={styles.lowerContainer}>

                </View>
                <FooterTabs></FooterTabs>
            </View >
        )
    }
}

export default Activity

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    upperContainer: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        paddingTop: 40,
    },
    lowerContainer: {
        flex: 6,
        width: '100%',
        backgroundColor: '#333',
    }
});