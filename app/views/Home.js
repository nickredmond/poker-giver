import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export class Home extends React.Component {
    static navigationOptions = {
        header: null
    };

    navigate = (routeName) => {
        const {navigate} = this.props.navigation;
        navigate(routeName + 'Route');
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => this.navigate('Table')}>
                    <Text style={styles.buttonText}>play now</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
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