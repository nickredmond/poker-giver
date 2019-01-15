import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getTables } from '../services/TableService';
import { getUserToken } from '../services/PlayerService';
import { PokerGiverText } from './partial/PokerGiverText';
import { PokerGiverButton } from './partial/PokerGiverButton';

export class TablesList extends React.Component {
    static navigationOptions = {
        title: 'Tables'
    };

    constructor(props) {
        super(props);

        getUserToken().then(token => {
            getTables(token).then(
                result => {
                    if (result.isSuccess) {
                        this.setState({ tables: result.tables || [] });
                    }
                    else {
                        alert('There was a problem fetching tables.');
                    }
                },
                () => {
                    alert('There was a problem fetching tables.')
                }
            )
        })
    }

    getPlayersCountText = (table) => {
        const totalPlayers = (table.numberOfHumanPlayers || 0) + table.numberOfAiPlayers;
        return totalPlayers + '/' + table.numberOfPlayers;
    }

    selectedTable = (tableName, gameId) => {
        const {navigate} = this.props.navigation;
        navigate('Table', { tableName, gameId });
    }

    renderList = ({ item: table }) => {
        return (
            // todo: search games to join by name
            <TouchableOpacity style={[styles.tableItem, styles.button]} onPress={() => this.selectedTable(table.name, table.gameId)}>
                <Text style={styles.buttonText}>{ table.name }</Text>
                <Text style={[styles.buttonText, styles.playersCountText]}>{ this.getPlayersCountText(table) }</Text>
            </TouchableOpacity>
        )
    }
    
    goToCreateTable = () => {
        const { navigate } = this.props.navigation;
        navigate('TableCreate');
    }

    render() {
        return (
            <View style={styles.container}>
                <PokerGiverText style={styles.listHeader} textValue={'touch any game below to join:'}></PokerGiverText>
                { 
                    this.state && this.state.tables && 
                    <FlatList style={styles.tableList} data={this.state.tables} renderItem={this.renderList} /> 
                }
                <PokerGiverButton 
                    onButtonPress={() => this.goToCreateTable()} 
                    buttonTitle={'create table'}>
                </PokerGiverButton>
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
    tableItem: {
        flexDirection: 'row'
    },
    tableList: {

    },
    button: {
        backgroundColor: '#88FF88',
        padding: 10,
        marginBottom: 10,
        marginLeft: '5%',
        width: '90%'
    },
    buttonText: {
        fontSize: 24
    },
    playersCountText: {
        marginLeft: 'auto'
    },
    listHeader: {
        fontSize: 18,
        marginTop: 5
    }
})