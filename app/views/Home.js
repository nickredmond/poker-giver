import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MainMenu } from './partial/MainMenu';
import { authenticate } from '../services/PlayerService';

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
        navigate(routeName, params);
    }

    goToTable = () => {
        // todo: use player account info
        this.navigate('TablesList',  {
            player: {
                id: 'b3c1b8a9-9fdd-4a82-a12a-750542629b77',
                name: 'Nick Redmond',
                numberOfChips: 2000
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isLoading && 
                    <View>Loading...</View>
                }

                {
                    this.state.isAuthenticated && 
                    <MainMenu></MainMenu>
                }

                {
                    !(this.state.isLoading || this.state.isAuthenticated) && 
                    <Login></Login>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        alignItems: 'center'
    }
});