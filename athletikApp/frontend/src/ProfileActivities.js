import React, { Component } from 'react'
import HomePage from './HomePage';

export class ProfileActivities extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HomePage userId='1' navigation={this.props.navigation}></HomePage>
        )
    }
}

export default ProfileActivities