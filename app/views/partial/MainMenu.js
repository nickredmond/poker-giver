import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PokerGiverButton } from './PokerGiverButton';
import { logOut, getPlayerAccountInfo } from '../../services/PlayerService';

export class MainMenu extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        getPlayerAccountInfo().then(
            accountInfo => {
                this.setState({
                    isPlayerWinner: accountInfo.moneyEarned > accountInfo.moneyDonated
                });
            },
            () => {
                alert('There was a problem getting your account info.');
            }
        )
    }

    goToTables = () => {
        this.props.goToTables();
    }
    goToRankings = () => {
        this.props.goToRankings();
    }
    goToDonate = () => {
        this.props.goToDonate();
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

                {
                    this.state && this.state.isPlayerWinner && 
                    <PokerGiverButton 
                    onButtonPress={() => this.goToDonate()} 
                    buttonTitle={'donate'}>
                </PokerGiverButton>
                }

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