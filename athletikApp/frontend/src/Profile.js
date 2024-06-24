import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Avatar, Text, Divider, Button } from '@rneui/themed';
import 'moment/locale/es';
import moment, { duration } from 'moment';
import { BACKEND_URL } from '../config';
import * as SecureStore from 'expo-secure-store';

export class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            fullname: '',
            email: '',
            allActivities: [],
            refreshing: false,
            monthlyStats: {
                distance: 0,
                duration: 0,
                maxSpeed: 0,
                accumulatedDrop: 0,
                averageSpeed: 0,
                activities: [],
            },
            allTimeStats: {
                distance: 0,
                duration: 0,
                maxSpeed: 0,
                accumulatedDrop: 0,
                averageSpeed: 0,
                activities: [],
            },
        }
    }

    componentDidMount() {
        this._getProfileInfo();
    }

    async componentWillUnmount() {
        await SecureStore.setItemAsync('profile_id', 'undefined')
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        await this._getProfileInfo();
        this.setState({ refreshing: false });
    }

    _processActivities() {
        const monthlyActivities = this.state.allActivities.filter(activity => {
            let date = new Date(activity.time);
            let month = moment().subtract(1, 'month');
            return date >= month;
        });
        const allTimeActivities = this.state.allActivities.filter(activity => {
            let date = new Date(activity.time);
            let month = moment().subtract(1, 'month');
            return date < month;
        });

        monthlySum = {
            distance: 0,
            duration: 0,
            maxSpeed: 0,
            accumulatedDrop: 0,
            averageSpeed: 0,
            accumulatedSpeed: 0,
            activities: [],
        };
        monthlyActivities.forEach(activity => {
            monthlySum.distance += activity.distance;
            activityDuration = activity.duration;
            monthlySum.duration += moment.duration(activityDuration, 'hours').asHours();
            monthlySum.accumulatedDrop += activity.accumulatedDrop;
            monthlySum.accumulatedSpeed += activity.averageSpeed;
            monthlySum.maxSpeed = Math.max(monthlySum.maxSpeed, activity.maxSpeed);
            monthlySum.activities.push(activity);
        });

        if (monthlyActivities.length > 0) {
            monthlySum.averageSpeed = monthlySum.accumulatedSpeed / monthlyActivities.length;
            monthlySum.averageSpeed = Math.round(monthlySum.averageSpeed);
            monthlySum.duration = Math.ceil(monthlySum.duration).toString() + ' h'
        } else {
            allTimeSum.duration = '0 h'
        }

        allTimeSum = {
            distance: 0,
            duration: 0,
            maxSpeed: 0,
            accumulatedDrop: 0,
            averageSpeed: 0,
            accumulatedSpeed: 0,
            activities: [],
        };
        allTimeActivities.forEach(activity => {
            allTimeSum.distance += activity.distance;
            activityDuration = activity.duration;
            allTimeSum.duration += moment.duration(activityDuration, 'hours').asHours();
            allTimeSum.accumulatedDrop += activity.accumulatedDrop;
            allTimeSum.accumulatedSpeed += activity.averageSpeed;
            allTimeSum.maxSpeed = Math.max(allTimeSum.maxSpeed, activity.maxSpeed);
            allTimeSum.activities.push(activity);
        });

        if (allTimeActivities.length > 0) {
            allTimeSum.averageSpeed = allTimeSum.accumulatedSpeed / allTimeActivities.length;
            allTimeSum.averageSpeed = Math.round(allTimeSum.averageSpeed);
            allTimeSum.duration = Math.ceil(allTimeSum.duration).toString() + ' h'
        } else {
            allTimeSum.duration = '0 h'
        }

        this.setState({ monthlyStats: monthlySum, allTimeStats: allTimeSum })
    }

    async _getProfileInfo() {
        console.log(JSON.stringify(this.props.route.params));
        const storedUserId = await SecureStore.getItemAsync('id'),
            storedProfileId = await SecureStore.getItemAsync('profile_id')
        token = await SecureStore.getItemAsync('secure_token');

        fetchUserId = storedProfileId != 'undefined' && storedProfileId ? storedProfileId : storedUserId;
        fetch(BACKEND_URL + '/api/v1/activities/?user_id=' + fetchUserId,
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
                    this.setState({
                        username: parsedResponse.user_info.username,
                        email: parsedResponse.user_info.email,
                        fullname: parsedResponse.user_info.fullname,
                        allActivities: parsedResponse.activities
                    });
                    this._processActivities();

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
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh} />
                    }>
                    <View style={styles.postCard}>
                        <View style={styles.row}>
                            <Avatar
                                size={80}
                                rounded
                                title={this.state.username?.charAt(0).toUpperCase()}
                                containerStyle={{ backgroundColor: 'green' }}
                            />
                            <View style={styles.col}>
                                <Text style={styles.h1}>
                                    {this.state.fullname}
                                </Text>
                                <Text style={styles.h2}>
                                    {this.state.username}
                                </Text>
                                <Text style={styles.h3}>
                                    {this.state.email}
                                </Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 3 }}></Divider>

                    </View>
                    <View style={styles.centerRow}>
                        <Text style={styles.h15}>
                            ESTADÍSTICAS
                        </Text>
                    </View>
                    <View style={styles.postCard}>
                        <View style={styles.centerRow}>
                            <Text style={styles.h2} >
                                Este mes
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.centerCol}>
                                <Text>{this.state.monthlyStats.distance} km</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Distancia</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.centerCol}>
                                <Text>{parseInt(this.state.monthlyStats.accumulatedDrop)} m</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Desnivel</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>
                        <View style={styles.row}>
                            <View style={styles.centerCol}>
                                <Text>{this.state.monthlyStats.averageSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad media</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.centerCol}>
                                <Text>{this.state.monthlyStats.maxSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad máxima</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>
                        <View style={styles.row}>

                            <View style={styles.centerCol}>
                                <Text>{this.state.monthlyStats.activities.length}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Actividades</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.centerCol}>
                                <Text>{this.state.monthlyStats.duration}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Duración total</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>

                        <View style={styles.centerRow}>
                            <Text style={styles.h2} >
                                Todos los tiempos
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.centerCol}>
                                <Text>{this.state.allTimeStats.distance} km</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Distancia</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.centerCol}>
                                <Text>{this.state.allTimeStats.accumulatedDrop} m</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Desnivel</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>
                        <View style={styles.row}>
                            <View style={styles.centerCol}>
                                <Text>{this.state.allTimeStats.averageSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad media</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.centerCol}>
                                <Text>{this.state.allTimeStats.maxSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad máxima</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>
                        <View style={styles.row}>

                            <View style={styles.centerCol}>
                                <Text>{this.state.allTimeStats.activities.length}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Actividades</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.centerCol}>
                                <Text>{this.state.allTimeStats.duration}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Duración total</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 5 }}></Divider>
                    </View>
                </ScrollView >
            </View >
        )
    }
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    centerCol: {
        flex: 1,
        alignItems: 'center'
    },
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    h15: {
        fontSize: 28,
        fontWeight: 'semibold',
        marginBottom: 3,
        color: 'dimgray',
    },
    centerRow: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    h2: {
        fontSize: 19,
        fontWeight: '600',
        paddingBottom: 5
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