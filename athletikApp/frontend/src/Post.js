import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, ActionSheetIOS, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Avatar, Text, Divider, Button } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/es';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { CommonActions } from '@react-navigation/native';
import { BACKEND_URL } from '../config';

const activityTypeByIcon = {
    mtb: 'bicycle',
    bic: 'bicycle',
    hik: 'golf',
    run: 'fitness',
    walk: 'walk-outline'
}

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.route.params.post,
            initialRegion: {
                latitude: props.route.params.post.routeCoordinates[0]?.latitude,
                longitude: props.route.params.post.routeCoordinates[0]?.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            routeCoordinates: []
        }
        moment.locale('es');
    }

    componentDidMount() {
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={this.handleOnPress}
                    color='white'
                    containerStyle={{ marginRight: -10 }}
                    iconPosition='right'
                    icon={<Ionicons name='ellipsis-horizontal-outline' size={20} />}

                />
            ),
        });
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

    createDeletePostDialog() {
        Alert.alert('¿Estás seguro?',
            'Si eliminas esta actividad, se borrará de forma definitiva.', [
            {
                text: 'Eliminar',
                onPress: () => this.handleDeletePost(),
                style: 'destructive',
            },
            {
                text: 'Cancelar',
                style: 'cancel'
            },
        ])
    }


    handleDeletePost = async () => {
        const token = await SecureStore.getItemAsync('secure_token');
        fetch(BACKEND_URL + '/api/v1/posts/?post_id=' + this.state.id,
            {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token,
                },
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    storedUserId = await SecureStore.getItemAsync('id');
                    this.props.navigation.navigate('ProfileActivities');

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

    _parseDuration(duration) {
        const hh = duration.slice(4, 6);
        const mm = duration.slice(7, 9);
        const ss = duration.slice(10, 12);

        return hh + ':' + mm + ':' + ss;
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
                                title={this.state.username?.charAt(0).toUpperCase()}
                                containerStyle={{ backgroundColor: 'green' }}
                            />
                            <View style={styles.col}>
                                <Text style={styles.h1}>
                                    {this.state.username}
                                </Text>
                                <View style={styles.row}>
                                    <Ionicons name={activityTypeByIcon[this.state.type]} size={20} style={{ marginRight: 5 }} />
                                    <Text>
                                        {moment(this.state.time).format('LLL')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.h2}>
                                {this.state.title}
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: 'flex-start',
                            marginBottom: 0,
                            alignItems: 'center'
                        }}>
                            <Text style={styles.h3}>
                                {this.state.description}
                            </Text>
                        </View>

                        <Divider style={{ marginTop: 15 }}></Divider>

                        <View style={styles.row}>
                            <MapView
                                // provider={PROVIDER_GOOGLE}
                                style={styles.mapStyle}
                                initialRegion={this.state.initialRegion}
                                mapType="standard"
                                scrollEnabled={false}
                                zoomEnabled={false}
                                rotateEnabled={false}
                            >
                                <Polyline
                                    coordinates={this.state.routeCoordinates}
                                    strokeColor="#4A80F5"
                                    strokeWidth={2} />
                            </MapView>
                        </View>

                        <Divider style={{ marginBottom: 10, marginTop: -10 }}></Divider>

                        <View style={styles.row}>
                            <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                <Text>{this.state.distance} km</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Distancia</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                <Text>{this.state.accumulatedDrop} m</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Desnivel</Text>
                            </View>
                        </View>

                        <Divider style={{ marginBottom: 10 }}></Divider>

                        <View style={styles.row}>
                            <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                <Text>{this.state.averageSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad media</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                <Text>{this.state.maxSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad máxima</Text>
                            </View>
                        </View>

                        <Divider style={{ marginBottom: 10 }}></Divider>

                        <View style={styles.row}>
                            <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                <Text>{this._parseDuration(this.state.duration)}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Duración</Text>
                            </View>
                        </View>

                        <Divider style={{ marginBottom: 10 }}></Divider>
                    </View>
                </ScrollView >
            </View >
        )
    }
}

export default Post

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