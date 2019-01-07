import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export class Home extends React.Component {
    static navigationOptions = {
        header: null
    };

    navigate = (routeName, params) => {
        const {navigate} = this.props.navigation;
        navigate(routeName, params);
    }

    goToTable = () => {
        // todo: use player account info
        this.navigate('Table', {
            gameId: '73bf5cc7-70e3-4ed2-8766-8a2e47e6fc2a',
            player: {
                id: 'b3c1b8a9-9fdd-4a82-a12a-750542629b77',
                name: 'Nick Redmond',
                numberOfChips: 2000
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.goToTable.bind()}>
                    <Text style={styles.buttonText}>play now</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
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