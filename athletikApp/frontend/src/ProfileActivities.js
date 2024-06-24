import React, { Component } from 'react';
import * as SecureStore from 'expo-secure-store';
import HomePage from './HomePage';


export class ProfileActivities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: undefined
        }
    }

    async componentDidMount() {
        const userId = this.props.route.params?.userId;

        if (userId === undefined) {
            storedUserId = await SecureStore.getItemAsync('id');
            await this.setState({ userId: storedUserId });
        } else {
            await this.setState({ userId: this.props.route.params.userId });
            await this.forceUpdate();
        }
    }

    render() {
        return (
            <HomePage userId={
                this.state.userId
            } navigation={this.props.navigation}></HomePage>
        )
    }
}

export default ProfileActivities