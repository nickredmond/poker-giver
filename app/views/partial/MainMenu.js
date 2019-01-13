import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export class MainMenu extends React.Component {
    static navigationOptions = {
        header: null
    };

    goToTables = () => {
        this.props.goToTables();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.goToTables.bind()}>
                    <Text style={styles.buttonText}>play now</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#88FF88',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    buttonText: {
        fontSize: 22
    }
});