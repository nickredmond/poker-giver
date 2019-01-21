import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PokerGiverText } from './PokerGiverText';

export class PokerGiverLoadingSpinner extends React.Component {
    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <View style={styles.loadingView}>
                <ActivityIndicator size='large' color='#88FF88' />
                <PokerGiverText style={styles.loadingText} textValue={'Loading...'}></PokerGiverText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingView: {
        marginTop: 25,
        marginBottom: 25,
        padding: 10
    },
    loadingText: {
        fontSize: 18
    },
})