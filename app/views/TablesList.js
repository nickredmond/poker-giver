import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getTables } from '../services/TableService';

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
        getTables()
            .then(response => response.json())
            .then(tables => {
                this.setState({ tables });
            });
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
            <TouchableOpacity style={styles.tableItem} onPress={() => this.selectedTable(table.gameId)}>
                <Text>{ table.name }</Text>
                <Text>{ this.getPlayersCountText(table) }</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
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

    },
    tableItem: {
        flexDirection: 'row'
    },
    tableList: {

    }
})