import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, ActionSheetIOS, Alert } from 'react-native';
import { Avatar, Text, Divider, Button } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/es';
import { CommonActions } from '@react-navigation/native';

const activityTypeByIcon = {
    mtb: 'bicycle',
    bic: 'bicycle',
    hik: 'golf',
    run: 'fitness',
    walk: 'walk-outline'
}

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.route.params,
        }
    }

    handleOnPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancelar', 'Editar publicación', 'Eliminar'],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    this.handleModifyPost();
                } else if (buttonIndex === 2) {
                    this.createDeletePostDialog();
                }
            }
        )

    handleDeletePost = () => {
        fetch('http://192.168.1.22:8000/api/v1/users/' + this.state.id,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    const setParamsAction = CommonActions.setParams({
                        params: { refreshPage: true }
                    });
                    const backAction = CommonActions.goBack();

                    this.props.navigation.dispatch(setParamsAction);
                    this.props.navigation.dispatch(backAction);
                    return;
                }
                throw new Error(JSON.parse(await response.text()).message);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    handleModifyPost = () => {
        const postToModify = {
            id: this.state.id,
            type: this.state.type,
            time: this.state.time,
            distance: this.state.distance,
            averageSpeed: this.state.averageSpeed,
            duration: this._parseDuration(this.state.duration),
            maxSpeed: this.state.maxSpeed,
            accumulatedDrop: this.state.accumulatedDrop,
            routeCoordinates: this.state.routeCoordinates,
            title: this.state.title,
            description: this.state.description
        };
        this.props.navigation.navigate('ModifyActivityForm', { ...postToModify, modifyingPost: true });
    }

    _getProfileInfo() {
        fetch('http://192.168.1.22:8000/api/v1/users/',
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    this.setState()
                    return;
                }
                throw new Error(JSON.parse(await response.text()).message);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.postCard}>
                        <View style={styles.row}>
                            <Avatar
                                size={50}
                                rounded
                                // title={this.state.username?.charAt(0).toUpperCase()}
                                title={'pepe'}
                                containerStyle={{ backgroundColor: 'green' }}
                            />
                            <View style={styles.col}>
                                <Text style={styles.h1}>
                                    {/* {this.state.username} */}
                                    pepe
                                </Text>
                                <View style={styles.row}>
                                    <Ionicons name={activityTypeByIcon[this.state.type]} size={20} style={{ marginRight: 5 }} />
                                    <Text>
                                        {moment(this.state.time).format('LLL')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView >
            </View >
        )
    }
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'light-grey',
    },
    postCard: {
        width: '100%',
        padding: 10,
        paddingBottom: 0,
        backgroundColor: '#fff',
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 5,
    },
    row: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        marginBottom: 10,
        alignItems: 'center'
    },
    col: {
        flex: 1,
        marginLeft: 10,
        marginTop: 5,
    },
    h1: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 3
    },
    h2: {
        fontSize: 19,
        fontWeight: '600',
    },
    h3: {
        fontSize: 16,
        fontWeight: '400',
    },
    mapStyle: {
        width: '105.5%',
        height: 250,
        marginLeft: -10,
        marginTop: 10,
        marginBottom: 10
    },
});