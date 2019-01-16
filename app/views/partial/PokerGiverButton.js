import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export class PokerGiverButton extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <TouchableOpacity style={styles.createTableButton} onPress={() => this.props.onButtonPress()}>
                <Text style={styles.createTableButtonText}>{this.props.buttonTitle}</Text>
            </TouchableOpacity>
        )
    }
}

export const styles = StyleSheet.create({
    createTableButton: {
        backgroundColor: '#117711',
        padding: 10,
        marginBottom: 20,
        width: '50%'
    },
    createTableButtonText: {
        color: '#efefef',
        textAlign: 'center',
        fontSize: 26
    }
});