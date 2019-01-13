import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getTables } from '../services/TableService';
import { getUserToken } from '../services/PlayerService';
import { PokerGiverText } from './partial/PokerGiverText';

export class TablesList extends React.Component {
    static navigationOptions = {
        title: 'Tables'
    };

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        this.state = {
            player: navigation.getParam('player')
        };
        getUserToken().then(token => {
            getTables(token)
                .then(response => response.json())
                .then(tables => {
                    this.setState({ tables });
                });
        })
    }

    getPlayersCountText = (table) => {
        const totalPlayers = (table.numberOfHumanPlayers || 0) + table.numberOfAiPlayers;
        return totalPlayers + '/' + table.numberOfPlayers;
    }

    selectedTable = (gameId) => {
        const {navigate} = this.props.navigation;
        navigate('Table', {
            gameId,
            player: this.state.player
            // {
            //     id: 'b3c1b8a9-9fdd-4a82-a12a-750542629b77',
            //     name: 'Nick Redmond',
            //     numberOfChips: 2000
            // }
        });
    }

    renderList = ({ item: table }) => {
        return (
            // todo: search games to join by name
            <TouchableOpacity style={[styles.tableItem, styles.button]} onPress={() => this.selectedTable(table.gameId)}>
                <Text style={styles.buttonText}>{ table.name }</Text>
                <Text style={[styles.buttonText, styles.playersCountText]}>{ this.getPlayersCountText(table) }</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <PokerGiverText style={styles.listHeader} textValue={'touch any game below to join:'}></PokerGiverText>
                { 
                    this.state.tables && 
                    <FlatList style={styles.tableList} data={this.state.tables} renderItem={this.renderList} /> 
                }
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
        marginBottom: 5,
        marginTop: 5
    }
})