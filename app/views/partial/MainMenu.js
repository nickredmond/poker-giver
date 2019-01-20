import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PokerGiverButton } from './PokerGiverButton';
import { logOut } from '../../services/PlayerService';

export class MainMenu extends React.Component {
    static navigationOptions = {
        header: null
    };

    goToTables = () => {
        this.props.goToTables();
    }
    goToRankings = () => {
        this.props.goToRankings();
    }
    logOut = () => {
        logOut().then(isSuccess => {
            if (isSuccess) {
                this.props.loggedOut();
            }
            else {
                alert('There was an issue logging out.');
            }
        }, () => { alert('There was an issue logging out.'); });
    }

    render() {
        return (
            <View style={styles.container}>
                <PokerGiverButton 
                    onButtonPress={() => this.goToTables()} 
                    buttonTitle={'play now'}>
                </PokerGiverButton>
                <PokerGiverButton 
                    onButtonPress={() => this.goToRankings()} 
                    buttonTitle={'rankings'}>
                </PokerGiverButton>
                <PokerGiverButton 
                    onButtonPress={() => this.logOut()} 
                    buttonTitle={'log out'}>
                </PokerGiverButton>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
});