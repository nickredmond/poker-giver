import React from 'react';
import { TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { PokerGiverText } from './PokerGiverText';

export class CharityNavigatorAttribution extends React.Component {
    openCharityNavigator = () => {
        Linking.openURL(this.props.linkbackUrl);
    }

    render() {
        return (
            <TouchableOpacity style={styles.attributionLink} onPress={() => this.openCharityNavigator() }>
                <PokerGiverText style={styles.link} textValue={'Powered by Charity Navigator'}></PokerGiverText>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    attributionLink: {
        width: '60%'
    },
    link: {
        fontSize: 16,
        textDecorationLine: 'underline'
    }
})