import React from 'react';
import { 
    View, Text, TextInput, 
    TouchableOpacity, FlatList, Keyboard,
    StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { PokerGiverText } from './partial/PokerGiverText';
import { getUserToken, getPlayerAccountInfo } from '../services/PlayerService';
import { searchCharities } from '../services/CharityService';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { PokerGiverLoadingSpinner } from './partial/PokerGiverLoadingSpinner';
import { CharityNavigatorAttribution } from './partial/CharityNavigatorAttribution';

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

    setQuery = (text) => {
        this.setState({ queryText: text, queryChanged: true });
    }
    queryCharities = () => {
        Keyboard.dismiss();

        if (this.state.queryText && this.state.queryChanged) {
            this.setState({ isSearching: true, queryChanged: false });
            getUserToken().then(
                token => {
                    searchCharities(this.state.queryText, token).then(
                        charities => {
                            this.setState({
                                isSearching: false,
                                charities
                            });
                        },
                        () => {
                            alert('There was a problem searching for charities.');
                        }
                    )
                },
                () => {
                    alert('There was a problem reading from device storage.')
                }
            )
        }
    }

    charitySelected = (charity) => {
        const { navigate } = this.props.navigation;
        navigate('Charity', {
            charity,
            availableBalance: this.state.availableBalance
        });
    }

    renderList = ({ item: charity }) => {
        return (
            <TouchableOpacity style={styles.charityItem} onPress={() => this.charitySelected(charity)}>
                <Text style={styles.charityItemText}>{ charity.name }</Text>
            </TouchableOpacity>
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
                <PokerGiverText style={styles.areaTitle} textValue={'search for charities'}></PokerGiverText>
                <View style={styles.searchArea}>
                    <View style={styles.inputFormGroup}>
                        <TextInput style={styles.input} onChangeText={text => this.setQuery(text)}></TextInput>
                        <TouchableOpacity style={styles.searchButton} onPress={this.queryCharities.bind()}>
                            <Entypo name='magnifying-glass' style={styles.buttonIcon} />
                        </TouchableOpacity>
                    </View>
                    <CharityNavigatorAttribution linkbackUrl={'https://www.charitynavigator.org/'}></CharityNavigatorAttribution>
                </View>
                <PokerGiverText style={styles.areaTitle} textValue={'results'}></PokerGiverText>
                <View style={styles.searchResults}>
                    {
                        this.state && this.state.isSearching && 
                        <PokerGiverLoadingSpinner></PokerGiverLoadingSpinner>
                    }

                    {
                        this.state && !this.state.isSearching && this.state.charities && 
                        <View style={styles.charityResults}>
                            <FlatList data={this.state.charities} renderItem={this.renderList}></FlatList>
                        </View>
                    }
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
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10
    },
    searchArea: {
        alignSelf: 'stretch',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 5
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
        fontSize: 48,
        color: '#efefef'
    },
    searchButton: {
        backgroundColor: '#0062cc',
        flex: 2,
        paddingLeft: 5,
        paddingRight: 5
    },
    input: {
        backgroundColor: '#efefef',
        flex: 14
    },
    inputFormGroup: {
        alignSelf: 'stretch',
        flexDirection: 'row'
    },
    searchResults: {
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center'
    },
    charityItem: {
        backgroundColor: '#88FF88',
        padding: 10,
        margin: 5
    },
    charityItemText: {
        color: '#222',
        fontSize: 16
    },
    charityResults: {
        height: '70%',
        alignItems: 'center'
    }
})