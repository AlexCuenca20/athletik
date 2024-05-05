import React, { Component } from 'react'
import { Text } from '@rneui/themed';
import HomePage from './HomePage';

export class Profile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HomePage userId='1' navigation={this.props.navigation}></HomePage>
        )
    }
}

export default Profile