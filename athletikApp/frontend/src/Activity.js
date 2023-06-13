import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { Button } from '@rneui/themed';
import { Stopwatch } from 'react-native-stopwatch-timer';
import moment from 'moment';

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_STATE = {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    altitude: 0,
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: {},
    coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    }),
    activityStarted: false,
    activityPaused: false,
    activityCanceled: false,
    timerRunning: false,
    time: moment()
        .format(),
    activityType: 'mtb',
    speed: 0,
    duration: 0,
    msecsDuration: 1,
    maxSpeed: 0,
    accumulatedDrop: 0,
    averageSpeed: 0,
    accumulatedSpeed: 0
};

export class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, ...props.route.params };
    }

    componentDidUpdate = (nextProps) => {
        if (nextProps.route.params?.activityCanceled !== this.props.route.params?.activityCanceled) {
            const prevCoordinate = this.state.coordinate;
            this.setState({
                routeCoordinates: [],
                distanceTravelled: 0,
                prevLatLng: {},
                activityStarted: false,
                activityPaused: false,
                activityCanceled: true,
                timerRunning: false,
                time: moment()
                    .format(),
                activityType: '',
                speed: 0,
                duration: 0,
                msecsDuration: 1,
                maxSpeed: 0,
                accumulatedDrop: 0,
                averageSpeed: 0,
                accumulatedSpeed: 0
            })
        }
    }

    async componentDidMount() {
        let { status } = await Location.requestForegroundPermissionsAsync()

        if (status === 'granted')
            this.watchID = await Location.watchPositionAsync({},
                location => {

                    const { coordinate, routeCoordinates, distanceTravelled } = this.state;
                    const { latitude, longitude, altitude, speed } = location.coords;

                    const newCoordinate = {
                        latitude,
                        longitude
                    };
                    if (Platform.OS === "android") {
                        if (this.marker) {
                            this.marker._component.animateMarkerToCoordinate(
                                newCoordinate,
                                500
                            );
                        }
                    } else {
                        coordinate.timing(newCoordinate).start();
                    }
                    this.setState({
                        latitude,
                        longitude,
                        altitude,
                        routeCoordinates: routeCoordinates.concat([newCoordinate]),
                        distanceTravelled:
                            parseFloat(
                                distanceTravelled + this.calcDistance(newCoordinate)
                            ).toFixed(2),
                        prevLatLng: newCoordinate,
                        maxSpeed: this.calcMaxSpeed(speed),
                        accumulatedSpeed: this.state.accumulatedSpeed + speed,
                        averageSpeed: this.calcAverageSpeed(speed)
                    });
                }

            );
    }

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    calcMaxSpeed = newSpeed => {
        const { maxSpeed } = this.state;
        let formattedSpeed;
        if (newSpeed > maxSpeed) formattedSpeed = newSpeed
        else formattedSpeed = maxSpeed

        return parseFloat(formattedSpeed).toFixed(2);
    };

    calcAverageSpeed = newSpeed => {
        const { accumulatedSpeed, msecsDuration } = this.state;

        const averageSpeed = (accumulatedSpeed + newSpeed) / msecsDuration

        return parseFloat(averageSpeed * 3.6).toFixed(2);
    };

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    handleStartPress() {
        if (!this.state.activityStarted)
            this.setState({
                activityStarted: true,
                timerRunning: true,
                activityCanceled: false
            });
        else if (!this.state.activityPaused)
            this.setState({
                activityPaused: true,
                timerRunning: false
            });
        else if (this.state.activityPaused)
            this.setState({
                activityPaused: false,
                timerRunning: true,
            });
    }

    handleFinishPress() {
        this.props.navigation.navigate('SaveActivityForm', {
            type: this.state.activityType,
            time: this.state.time,
            distance: this.state.distanceTravelled * 1000,
            averageSpeed: this.state.averageSpeed,
            duration: this.state.duration,
            maxSpeed: this.state.maxSpeed,
            accumulatedDrop: this.state.accumulatedDrop,
            routeCoordinates: this.state.routeCoordinates
        });
    }

    Buttons = () => {
        if (this.state.activityPaused)
            return <View style={{ flexDirection: "row", }}>
                <Button
                    buttonStyle={{ backgroundColor: '#d63a52' }}
                    containerStyle={{ width: '50%', padding: 10 }}
                    title='FINALIZAR'
                    size='lg'
                    titleStyle={{
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleFinishPress()}
                >
                </Button>
                <Button
                    buttonStyle={{ backgroundColor: '#4eae6e' }}
                    containerStyle={{ width: '50%', padding: 10 }}
                    title='REANUDAR'
                    size='lg'
                    titleStyle={{
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleStartPress()}
                >
                </Button>
            </View>
        else
            return <View>
                <Button
                    buttonStyle={{ backgroundColor: '#000' }}
                    containerStyle={{ width: '100%', padding: 10 }}
                    title={this.getButtonTitle()}
                    size='lg'
                    titleStyle={{
                        fontSize: 14,
                        fontWeight: 'bold',
                    }}
                    onPress={() => this.handleStartPress()}
                ></Button>
            </View>

    }

    getButtonTitle() {
        if (!this.state.activityStarted) {
            return 'INICIAR'
        } else if (!this.state.activityPaused) {
            return 'PAUSAR'
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <View style={styles.row}>
                        <Text style={{ textAlign: 'center', fontSize: 10, paddingBottom: 2 }}>
                            Duración
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 50 }}>
                            <Stopwatch
                                start={this.state.timerRunning}
                                reset={this.state.activityCanceled}
                                options={options}
                                getTime={(d) => { this.state.duration = d; }}
                                getMsecs={(ms) => { this.state.msecDuration = ms }}
                            />
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col1}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                                {this.state.distanceTravelled} km
                            </Text>
                        </View>
                        <View style={styles.col2}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                                {parseFloat(this.state.accumulatedDrop).toFixed(2)} m
                            </Text>
                        </View>
                        <View style={styles.col3}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                                {this.state.averageSpeed} km/h
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.col1}>
                            <Text style={{ textAlign: 'center', fontSize: 10, paddingTop: 5 }}>
                                Distancia
                            </Text>
                        </View>
                        <View style={styles.col2}>
                            <Text style={{ textAlign: 'center', fontSize: 10, paddingTop: 5 }}>
                                Desnivel
                            </Text>
                        </View>
                        <View style={styles.col3}>
                            <Text style={{ textAlign: 'center', fontSize: 10, paddingTop: 5 }}>
                                Ritmo
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.lowerContainer}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.mapStyle}
                        showUserLocation
                        followUserLocation
                        loadingEnabled
                        region={this.getMapRegion()}
                        mapType="standard"
                    >
                        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
                        <Marker.Animated
                            ref={marker => {
                                this.marker = marker;
                            }}
                            coordinate={this.state.coordinate}
                        />

                    </MapView>
                    <View style={styles.buttonContainer}>
                        <Button style={[styles.bubble, styles.button]}>
                            <Text style={styles.bottomBarContent}>
                                {this.state.latitude}, {this.state.longitude}
                            </Text>
                        </Button>
                    </View>
                    <this.Buttons />
                </View>
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
        flex: 2,
        width: '100%',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 20
    },
    lowerContainer: {
        flex: 10,
        width: '100%',
    },
    mapStyle: {
        flex: 3,
        width: '100%',
        height: '100%',
        alignItems: 'flex-end',
        alignContent: 'flex-end'
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    col1: {
        backgroundColor: "fff",
        borderColor: "#000",
        flex: 1
    },
    col2: {
        backgroundColor: "fff",
        borderColor: "#000",
        flex: 1
    },
    col3: {
        backgroundColor: "fff",
        borderColor: "#000",
        flex: 1
    },
});

const options = {
    container: {
        backgroundColor: '#FFF',
        padding: 5,
        borderRadius: 5,
        width: 200,
        alignItems: 'center',
    },
    text: {
        fontSize: 25,
        color: '#000',
        marginLeft: 7,
    },
};
