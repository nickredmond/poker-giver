import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PokerGiverText } from './PokerGiverText';

export class PokerGiverLoadingSpinner extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loadingMessage: this.props.loadingMessage || 'Loading...'
        };
    }

    render() {
        return (
            <View style={styles.loadingView}>
                <ActivityIndicator size='large' color='#88FF88' />
                <PokerGiverText style={styles.loadingText} textValue={this.state.loadingMessage}></PokerGiverText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    loadingView: {
        marginTop: 25,
        marginBottom: 25,
        padding: 10,
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 18
    },
})