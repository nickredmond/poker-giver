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
    loggedOut = () => {
        this.setState({ isAuthenticated: false });
    }

    goToTables = () => {
        const { navigate } = this.props.navigation;
        navigate('TablesList');
    }
    goToRankings = () => {
        const { navigate } = this.props.navigation;
        navigate('Rankings');
    }
    goToDonate = () => {
        const { navigate } = this.props.navigation;
        navigate('CharitySearch');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>pfbt</Text>
                <Text style={styles.subtitle}>poker for a better tomorrow</Text>

                <View style={styles.homePageContent}>
                    {
                        this.state.isLoading && 
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading...</Text>
                        </View>
                    }

                    {
                        this.state.isAuthenticated && 
                        <MainMenu 
                            goToTables={this.goToTables} 
                            goToRankings={this.goToRankings}
                            goToDonate={this.goToDonate}
                            loggedOut={this.loggedOut}>
                        </MainMenu>
                    }

                    {
                        !(this.state.isLoading || this.state.isAuthenticated) && 
                        <Login loggedIn={this.loggedIn}></Login>
                    }
                </View>
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
    },
    loadingContainer: {
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 24,
        color: '#efefef'
    },
    title: {
        fontSize: 96,
        color: '#efefef'
    },
    subtitle: {
        fontSize: 16,
        color: '#ababab'
    },
    homePageContent: {
        flex: 1,
        alignItems: 'center',
        marginTop: 25
    }
});