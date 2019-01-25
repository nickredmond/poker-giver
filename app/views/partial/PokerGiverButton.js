import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export class PokerGiverButton extends React.Component {
    static navigationOptions = {
        header: null
    };

    static buttonStyle = {
        padding: 10,
        marginBottom: 20,
        width: '50%'
    };
    static defaultButtonColor = {
        backgroundColor: '#117711'
    };

    getButtonStyle = () => {
        const styles = [PokerGiverButton.buttonStyle];

        if (this.props.buttonColor) {
            const customButtonColor = { backgroundColor: this.props.buttonColor };
            styles.push(customButtonColor);
        }
        else {
            styles.push(PokerGiverButton.defaultButtonColor);
        }

        return styles;
    }

    render() {
        return (
            <TouchableOpacity style={this.getButtonStyle()} onPress={() => this.props.onButtonPress()}>
                <Text style={styles.createTableButtonText}>{this.props.buttonTitle}</Text>
            </TouchableOpacity>
        )
    }
}

export const styles = StyleSheet.create({ 
    createTableButtonText: {
        color: '#efefef',
        textAlign: 'center',
        fontSize: 26
    }
});