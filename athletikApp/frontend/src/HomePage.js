import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl, TouchableHighlight } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Avatar, Text, Divider } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/locale/es';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { BACKEND_URL } from '../config';
import { withNavigation } from 'react-navigation';

const activityTypeByIcon = {
    mtb: 'bicycle',
    bic: 'bicycle',
    hik: 'image',
    run: 'fitness',
    walk: 'walk-outline'
}

const LATITUDE_DELTA = 0.0922 / 10;
const LONGITUDE_DELTA = 0.0421 * 0.05;

export class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            refreshing: false,
            userId: undefined
        }
        moment.locale('es');
        // this.mapRefs = React.createRef([]);
    }

    componentDidMount() {
        this._onRefresh();
    }

    // async fitMapToPolyline(map, coords) {
    //     map?.current?.fitToCoordinates(coords, {
    //         edgePadding: {
    //             top: 20,
    //             right: 20,
    //             bottom: 20,
    //             left: 20,
    //         },
    //     });
    // }

    componentDidUpdate = (prevProps, prevState) => {
        if (prevProps.route?.params?.refreshPage !== this.props.route?.params?.refreshPage || (this.props.userId && this.state.userId !== this.props.userId)) {
            this._onRefresh();
            this.setState({ userId: this.props.userId })
            if (prevProps.route?.params?.refreshPage !== this.props.route?.params?.refreshPage) this.props.route.params.refreshPage = false;
        }
    }

    handleOnPress(post) {
        this.props.navigation.navigate('Post', { post });
    }

    async handleOnProfilePress(post) {
        await SecureStore.setItemAsync('profile_id', post.user_id.toString());
        this.props.navigation.navigate('OtherProfile', { screen: 'ProfileActivitiesStack', params: { screen: 'ProfileActivities', params: { userId: post.user_id } } });
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        await this._getAllPosts();
        this.setState({ refreshing: false });
    }

    async _getAllPosts() {
        let apiRoute = BACKEND_URL + '/api/v1/posts/';
        if (this.props.userId !== undefined) apiRoute += '?user_id=' + this.props.userId;

        const token = await SecureStore.getItemAsync('secure_token');

        fetch(apiRoute,
            {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token,
                },
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    parsedResponse = JSON.parse(await response.text());
                    await this.setState({ posts: parsedResponse })
                    return parsedResponse;
                }
                throw new Error(JSON.parse(await response.text()).message);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        let postCards = [];
        for (post of this.state.posts) {
            postCards.unshift(
                <TouchableHighlight key={post.id} underlayColor={'#light-grey'} onPress={this.handleOnPress.bind(this, post)} >
                    <View style={styles.cardBorder}>
                        <View style={styles.postCard}>
                            <View style={styles.row}>
                                <Avatar
                                    size={50}
                                    rounded
                                    title={post.username?.charAt(0).toUpperCase()}
                                    containerStyle={{ backgroundColor: 'green' }}
                                    onPress={this.handleOnProfilePress.bind(this, post)}
                                />
                                <View style={styles.col}>
                                    <Text style={styles.h1}>
                                        {post.username}
                                    </Text>
                                    <View style={styles.row}>
                                        <Ionicons name={activityTypeByIcon[post.type]} size={20} style={{ marginRight: 5 }} />
                                        <Text>
                                            {moment(post.time).format('LLL')}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.h2}>
                                    {post.title}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                    <Text>{post.distance} km</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                    }}>Distancia</Text>
                                </View>

                                <Divider orientation='vertical'></Divider>

                                <View style={{ ...{ alignItems: 'center' }, ...styles.col }}>
                                    <Text>{post.accumulatedDrop} m</Text>
                                    <Text style={{
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                    }}>Desnivel</Text>
                                </View>
                            </View>
                            <Divider style={{ marginBottom: 10 }}></Divider>
                        </View>
                        <MapView
                            // provider={PROVIDER_GOOGLE}
                            // key={post.id}
                            // ref={el => this.mapRefs?.current[post.id] = el}
                            style={styles.mapStyle}
                            initialRegion={{
                                latitude: post.routeCoordinates[0]?.latitude,
                                longitude: post.routeCoordinates[0]?.longitude,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA
                            }}
                            mapType="standard"
                            scrollEnabled={false}
                            zoomEnabled={false}
                            rotateEnabled={false}
                        >
                            <Polyline coordinates={post.routeCoordinates} strokeWidth={3} strokeColor="#2ecc71" geodesic={true} />
                        </MapView>
                    </View>
                </TouchableHighlight >
            );
            // this.fitMapToPolyline(currentMap, post.routeCoordinates);
        }

        return (
            <View style={styles.container} >
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh} />
                    }
                >
                    {
                        postCards.length ? postCards :
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name='megaphone-outline' size={200} style={{ marginTop: 20 }} />
                                <Text h4 style={{ textAlign: 'center' }}>Parece que esto está muy tranquilo... No se han publicado actividades aún</Text>
                            </View>
                    }
                </ScrollView>
            </View >
        )
    }
}

export default withNavigation(HomePage)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: 'white',
        height: '100%'
    },
    postCard: {
        width: '100%',
        padding: 10,
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    cardBorder: {
        shadowColor: '#222',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: 10,
        backgroundColor: '#fff',
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
        paddingLeft: 60
    },
    mapStyle: {
        width: '100%',
        height: 250
    },
});