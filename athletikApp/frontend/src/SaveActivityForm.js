import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Input, Button, Divider, CheckBox, Text } from '@rneui/themed';
import { PickerIOS } from '@react-native-picker/picker';
import moment from 'moment';
import { CommonActions } from '@react-navigation/native';
import { BACKEND_URL } from '../config';

export class SaveActivityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.route.params,
            isPost: true
        }
    }

    setIsPost(check) {
        this.setState({
            isPost: check
        })
    }

    setTitle(title) {
        this.setState({
            title: title
        })
    }

    setDescription(description) {
        this.setState({
            description: description
        })
    }

    setActivityType(type) {
        this.setState({
            type: type
        })
    }

    getButtonTitle() {
        if (!this.state.isPost || this.props.route.params?.modifyingPost) {
            return 'GUARDAR'
        } else {
            return 'PUBLICAR'
        }
    }

    _validateInputs() {
        const inputs = { title: this.state.title, description: this.state.description };
        return Object.values(inputs).every((input) => input !== '')
    }

    handleDiscardPress() {
        const setParamsAction = CommonActions.setParams({
            params: { refreshPage: true }
        });
        const backAction = CommonActions.goBack();

        this.props.navigation.dispatch(setParamsAction);
        this.props.navigation.dispatch(backAction);
    }

    handleSavePress = async () => {
        if (this.state.isPost && !this._validateInputs()) return;

        let apiRoute = BACKEND_URL + '/api/v1/activities/',
            apiMethod = 'POST';
        if (this.state.isPost) {
            apiRoute = BACKEND_URL + '/api/v1/posts/';
            if (this.props.route.params?.modifyingPost) {
                apiRoute += this.props.route.params.id + '/';
                apiMethod = 'PUT'
            }
        }

        const requestBody = {
            type: this.state.type,
            distance: this.state.distance,
            averageSpeed: this.state.averageSpeed,
            duration: this.state.duration,
            time: this.state.time,
            maxSpeed: this.state.maxSpeed,
            accumulatedDrop: this.state.accumulatedDrop,
            routeCoordinates: this.state.routeCoordinates,
            title: this.state.title,
            description: this.state.description
        };

        const token = await SecureStore.getItemAsync('secure_token');

        fetch(apiRoute,
            {
                method: apiMethod,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Token " + token,
                },
                body: JSON.stringify(requestBody),
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    if (!this.props.route.params?.modifyingPost) {
                        this.props.navigation.navigate('Activity', {
                            refreshPage: true
                        });
                        this.props.navigation.navigate('HomePage', {
                            refreshPage: true
                        });
                    } else {
                        this.props.navigation.navigate('ProfileActivities');
                    }
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.upperContainer}
                    enabled keyboardVerticalOffset={120}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        <Text h4 style={styles.sectionText}>Resumen</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text>{this.state.distance} km</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Distancia</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.col}>
                                <Text>{this.state.accumulatedDrop} m</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Desnivel</Text>
                            </View>


                        </View>
                        <Divider style={{ margin: 10 }}></Divider>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text>{this.state.averageSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad media</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.col}>
                                <Text>{this.state.maxSpeed} km/h</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Velocidad máxima</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text>{this.state.duration}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Duración</Text>
                            </View>
                        </View>
                        <Divider style={{ margin: 10 }}></Divider>

                        <Text h4 style={styles.sectionText}>Tipo de actividad</Text>
                        <PickerIOS
                            selectedValue={this.state.type}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setActivityType(itemValue)
                            }
                            itemStyle={styles.item}>
                            <PickerIOS.Item label="Bicicleta" value="bic" />
                            <PickerIOS.Item label="Bicicleta de montaña" value="mtb" />
                            <PickerIOS.Item label="Senderismo" value="hik" />
                            <PickerIOS.Item label="Carrera" value="run" />
                            <PickerIOS.Item label="Caminata" value="walk" />
                        </PickerIOS>

                        {this.props.route.params?.modifyingPost ? null : <View>
                            <Text h4 style={styles.sectionText}>Visibilidad</Text>
                            <CheckBox
                                center
                                title="No publicar actividad en la página de inicio ni el perfil"
                                checked={!this.state.isPost}
                                onPress={() => this.setIsPost(!this.state.isPost)}
                            />
                            <Text style={styles.sectionText}>Si no se publica la actividad, no se podrán añadir ni título ni descripción</Text>
                        </View>}
                        <Text h4 style={styles.sectionText}>Publicación</Text>
                        <View aria-disabled={!this.state.isPost} style={styles.detailsSection}>
                            <View style={styles.inputView}>
                                <Input
                                    placeholder="Título"
                                    editable={this.state.isPost}
                                    selectTextOnFocus={this.state.isPost}
                                    defaultValue={this.state.title}
                                    onChangeText={(title) => this.setTitle(title)}
                                />
                            </View>
                            <View style={styles.inputView}>
                                <Input
                                    placeholder="¿Cómo te ha ido? Describe más detalles sobre tu actividad"
                                    inputContainerStyle={{ height: '50%' }}
                                    multiline={true}
                                    editable={this.state.isPost}
                                    selectTextOnFocus={this.state.isPost}
                                    defaultValue={this.state.description}
                                    onChangeText={(description) => this.setDescription(description)}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                <Divider></Divider>
                <View style={styles.lowerContainer}>
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            buttonStyle={{ backgroundColor: '#d63a52', borderRadius: 10 }}
                            containerStyle={{ width: '50%', padding: 10 }}
                            title='DESCARTAR'
                            size='lg'
                            titleStyle={{
                                fontSize: 16,
                                fontWeight: 'bold'
                            }}
                            onPress={() => this.handleDiscardPress()}
                        >
                        </Button>
                        <Button
                            buttonStyle={{ backgroundColor: '#000', borderRadius: 10 }}
                            containerStyle={{ width: '50%', padding: 10 }}
                            title={this.getButtonTitle()}
                            size='lg'
                            titleStyle={{
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}
                            onPress={() => this.handleSavePress()}
                        >
                        </Button>
                    </View>
                </View>
            </View>
        )
    }
}

export default SaveActivityForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
    upperContainer: {
        flex: 8,
        width: '100%',
        paddingTop: 10,
        paddingBottom: 20
    },
    lowerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputView: {
        width: '100%',
    },
    detailsSection: {
        paddingTop: 5
    },
    sectionText: {
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold'
    },
    item: {
        fontSize: 14,
        textAlign: 'left',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: "row",
        justifyContent: 'space-between',
        margin: 5
    },
    col: {
        flex: 1,
        alignItems: 'center'
    },
});