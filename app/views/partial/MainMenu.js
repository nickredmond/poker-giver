import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PokerGiverButton } from './PokerGiverButton';

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
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    }
});