import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { PokerGiverText } from './partial/PokerGiverText';
import { getPlayerAccountInfo } from '../services/PlayerService';
import { searchCharities } from '../services/CharityService';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';

export class CharitySearch extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'Find Charities'
    };

    constructor(props) {
        super(props);
        this.state = {
            moneyEarned: 0,
            moneyDonated: 0,
            availableBalance: 0
        }

        getPlayerAccountInfo().then(
            accountInfo => {
                this.setState({
                    moneyEarned: accountInfo.moneyEarned,
                    moneyDonated: accountInfo.moneyDonated,
                    availableBalance: accountInfo.moneyEarned - accountInfo.moneyDonated
                });
            },
            () => {
                alert('There was a problem retrieving your account info.');
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <PokerGiverText style={styles.areaTitle} textValue={'account overview'}></PokerGiverText>
                <View style={styles.accountOverview}>
                    <View style={styles.accountOverviewRow}>
                        <Text style={styles.accountOverviewText}>Money Earned:</Text>
                        <Text style={[styles.accountOverviewText, styles.alignRight]}>${ this.state.moneyEarned }</Text>
                    </View>
                    <View style={styles.accountOverviewRow}>
                        <Text style={styles.accountOverviewText}>Money Donated:</Text>
                        <Text style={[styles.accountOverviewText, styles.alignRight]}>${ this.state.moneyDonated }</Text>
                    </View>
                    <View style={styles.accountOverviewRow}>
                        <Text style={styles.accountOverviewText}>Available Balance:</Text>
                        <Text style={[styles.accountOverviewText, styles.alignRight]}>${ this.state.availableBalance }</Text>
                    </View>
                </View>
                <View>
                    <PokerGiverText style={styles.areaTitle} textValue={'search for charities'}></PokerGiverText>
                    <View>
                        <TextInput></TextInput>
                        <TouchableOpacity>
                            <Entypo name='magnifying-glass' style={styles.buttonIcon} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Image></Image>
                        <PokerGiverText style={styles.link} textValue={'Powered by Charity Navigator'}></PokerGiverText>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#222'
    },
    accountOverview: {
        backgroundColor: '#d9edf7',
        alignSelf: 'stretch',
        margin: 10
    },
    accountOverviewText: {
        color: '#31708f',
        fontSize: 18
    },
    accountOverviewRow: {
        flexDirection: 'row',
        padding: 5
    },
    areaTitle: {
        fontSize: 24
    },  
    alignRight: {
        marginLeft: 'auto'
    },
    buttonIcon: {
        
    }
})