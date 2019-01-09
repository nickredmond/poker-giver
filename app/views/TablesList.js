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
        getTables().then(tables => {
            alert('got some tables')
            this.setState({ tables });
        });
    }

    getPlayersCountText = (players, maxPlayersCount) => {
        const playerCountText = players ? players.length : '0';
        return playerCountText + '/' + (maxPlayersCount || 0);
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

    renderList = ({ table }) => {
        return (
            <TouchableOpacity style={styles.tableItem} onPress={() => this.selectedTable(table.gameId)}>
                <Text>{ table.name }</Text>
                <Text>{ getPlayersCount(table.numberOfPlayers, table.maxPlayersCount) }</Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList style={styles.tableList} data={this.state.tables} renderItem={this.renderList} />
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