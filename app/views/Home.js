import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MainMenu } from './partial/MainMenu';
import { Login } from './partial/Login';
import { authenticate, getPlayerInfo } from '../services/PlayerService';

export class Home extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isAuthenticated: false
        };

        authenticate().then(isValid => {
            this.setState({
                isAuthenticated: isValid,
                isLoading: false
            });
        });
    }

    navigate = (routeName, params) => {
        const {navigate} = this.props.navigation;
        const navigationParams = params || null;
        navigate(routeName, navigationParams);
    }

    loggedIn = () => {
        this.setState({ isAuthenticated: true });
    }

    goToTables = () => {
        const { navigate } = this.props.navigation;
        navigate('TablesList');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>poker giver</Text>

                {
                    this.state.isLoading && 
                    <View><Text>Loading...</Text></View>
                }

                {
                    this.state.isAuthenticated && 
                    <MainMenu goToTables={this.goToTables}></MainMenu>
                }

                {
                    !(this.state.isLoading || this.state.isAuthenticated) && 
                    <Login loggedIn={this.loggedIn}></Login>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#222'
    }
});