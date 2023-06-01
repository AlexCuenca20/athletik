import React, { Component } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import haversine from 'haversine';
import { Button } from '@rneui/themed';
import { Stopwatch } from 'react-native-stopwatch-timer';

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export class Activity extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            timerRunning: false,
            activityType: '',
            speed: 0,
            duration: 0,
            maxSpeed: 0,
            accumulatedDrop: 0,
            averageSpeed: 0
        };
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
                        speed,
                        routeCoordinates: routeCoordinates.concat([newCoordinate]),
                        distanceTravelled:
                            distanceTravelled + this.calcDistance(newCoordinate),
                        prevLatLng: newCoordinate
                    });
                }
            );
    }

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
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
                timerRunning: true
            });
        else if (!this.state.activityPaused)
            this.setState({
                activityPaused: true,
                timerRunning: false
            });
        else if (this.state.activityPaused)
            this.setState({
                activityPaused: false,
                timerRunning: true
            });
    }

    handleFinishPress() {
        this.props.navigation.navigate('SaveActivityForm', {
            type: this.state.activityType,
            distance: this.state.distanceTravelled,
            averageSpeed: this.state.averageSpeed,
            duration: this.state.duration,
            maxSpeed: this.state.maxSpeed,
            accumulatedDrop: this.state.accumulatedDrop
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
                                options={options}
                            // getTime={this.getFormattedTime}
                            />
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col1}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                                {parseFloat(this.state.distanceTravelled).toFixed(2)} km
                            </Text>
                        </View>
                        <View style={styles.col2}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                                {parseFloat(this.state.altitude).toFixed(2)} m
                            </Text>
                        </View>
                        <View style={styles.col3}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>
                                {parseFloat(this.state.speed).toFixed(2) * 3.6} km/h
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
