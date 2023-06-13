import React, { Component } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Divider, CheckBox, Text } from '@rneui/themed';
import { PickerIOS } from '@react-native-picker/picker';
import moment from 'moment';

export class SaveActivityForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.route.params,
            title: '',
            description: '',
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
        if (!this.state.isPost) {
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
        this.props.navigation.navigate('Activity', {
            activityCanceled: true
        });
    }

    handleSavePress() {
        if (this.state.isPost && !this._validateInputs()) return;

        const apiRoute = this.state.isPost ?
            'http://192.168.1.22:8000/api/v1/posts/' :
            'http://192.168.1.22:8000/api/v1/activities/';

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

        fetch(apiRoute,
            {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            }
        )
            .then((response) => {
                if (response.ok) {
                    this.props.navigation.navigate('HomePage');
                    return;
                }
                throw new Error('Something went wrong');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.upperContainer}>
                    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                        <Text h4 style={styles.sectionText}>Resumen</Text>
                        <View style={styles.row}>
                            <View style={styles.col}>
                                <Text>{this.state.duration}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Duración</Text>
                            </View>

                            <Divider orientation='vertical'></Divider>

                            <View style={styles.col}>
                                <Text>{moment(this.state.time).format('D-M-Y, HH:mm')}</Text>
                                <Text style={{
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>Fecha</Text>
                            </View>
                        </View>
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

                        <Text h4 style={{ margin: 10, marginBottom: 0 }}>Tipo de actividad</Text>
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

                        <Text h4 style={styles.sectionText}>Visibilidad</Text>
                        <CheckBox
                            center
                            title="No publicar actividad en la página de inicio ni el perfil"
                            checked={!this.state.isPost}
                            onPress={() => this.setIsPost(!this.state.isPost)}
                        />
                        <Text style={styles.sectionText}>Si no se publica la actividad, no se podrán añadir ni título ni descripción</Text>

                        <Text h4 style={styles.sectionText}>Publicación</Text>
                        <View aria-disabled={!this.state.isPost} style={styles.detailsSection}>
                            <View style={styles.inputView}>
                                <Input
                                    placeholder="Título"
                                    editable={this.state.isPost}
                                    selectTextOnFocus={this.state.isPost}
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
                                    onChangeText={(description) => this.setDescription(description)}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View >
                <Divider></Divider>
                <View style={styles.lowerContainer}>
                    <View style={{ flexDirection: "row", }}>
                        <Button
                            buttonStyle={{ backgroundColor: '#d63a52' }}
                            containerStyle={{ width: '50%', padding: 10 }}
                            title='DESCARTAR'
                            size='lg'
                            titleStyle={{
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}
                            onPress={() => this.handleDiscardPress()}
                        >
                        </Button>
                        <Button
                            buttonStyle={{ backgroundColor: '#000' }}
                            containerStyle={{ width: '50%', padding: 10 }}
                            title={this.getButtonTitle()}
                            size='lg'
                            titleStyle={{
                                fontSize: 14,
                                fontWeight: 'bold',
                            }}
                            onPress={() => this.handleSavePress()}
                        >
                        </Button>
                    </View>
                </View>
            </View >
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
        textAlign: 'left',
        padding: 10
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