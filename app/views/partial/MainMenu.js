import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export class MainMenu extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.goToTable.bind()}>
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    buttonText: {
        fontSize: 22
    }
});