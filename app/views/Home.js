import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MainMenu } from './partial/MainMenu';
import { Login } from './partial/Login';
import { authenticate } from '../services/PlayerService';

export class Home extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);

        const isDonationProcessed = this.props.navigation.getParam('isDonationProcessed') || false;
        this.state = {
            isLoading: true,
            isAuthenticated: false,
            isDonationProcessed
        };
        
        if (isDonationProcessed) {
            setTimeout(() => {
                this.setState({ isDonationProcessed: false })
            }, 5000);
        }

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
    goToDonations = () => {
        const { navigate } = this.props.navigation;
        navigate('Donations');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>pfbt</Text>
                <Text style={styles.subtitle}>poker for a better tomorrow</Text>

                <View style={styles.homePageContent}>
                    {
                        this.state.isDonationProcessed && 
                        <Text style={styles.donationSuccessMessage}>Your donation has successfully been submitted.</Text>
                    }

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
                            goToDonations={this.goToDonations}
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
    },
    donationSuccessMessage: {
        color: '#3c763d',
        fontSize: 18,
        margin: 10,
        padding: 5,
        backgroundColor: '#dff0d8',
        borderWidth: 2,
        borderColor: '#d0e9c6',
        borderRadius: 3,
        textAlign: 'center'
    }
});