import React from 'react';
import { 
    View, FlatList, TextInput, 
    TouchableOpacity, Text, StyleSheet,
    ActivityIndicator
} from 'react-native';
import { getTables } from '../services/TableService';
import { getUserToken } from '../services/PlayerService';
import { PokerGiverText } from './partial/PokerGiverText';
import { PokerGiverButton } from './partial/PokerGiverButton';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { PokerGiverLoadingSpinner } from './partial/PokerGiverLoadingSpinner';

export class TablesList extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'Tables'
    };

    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () => {
            this.loadTablesList();
        });
    }

    loadTablesList = () => {
        this.setState({ query: null, queryText: '', isLoading: true });
        setInterval(() => {
            this.searchGames();
        }, 333);

        getUserToken().then(token => {
            getTables(token).then(
                result => {
                    if (result.isSuccess) {
                        this.setState({ 
                            tables: result.tables || [],
                            isLoading: false
                        });
                    }
                    else {
                        this.setState({ isLoading: false })
                        alert('There was a problem fetching tables.');
                    }
                },
                () => {
                    this.setState({ isLoading: false })
                    alert('There was a problem fetching tables.')
                }
            )
        })
    }

    getPlayersCountText = (table) => {
        const totalPlayers = (table.numberOfHumanPlayers || 0) + table.numberOfAiPlayers;
        return totalPlayers + '/' + table.numberOfPlayers;
    }

    selectedTable = (table) => {
        const {navigate} = this.props.navigation;
        navigate('Table', { table });
    }

    getTableName = (table) => {
        return (table.name && table.name.length > 35) ? table.name.substring(0, 35) + '...' : table.name;
    }

    renderList = ({ item: table }) => {
        return (
            <TouchableOpacity style={[styles.tableItem, styles.button]} onPress={() => this.selectedTable(table)}>
                <Text style={[styles.buttonText, styles.tableNameText]}>{ this.getTableName(table) }</Text>
                <Text style={[styles.buttonText, styles.turnTimerText]}>{ table.turnTimerSeconds }</Text>
                <Text style={[styles.buttonText, styles.playersCountText]}>{ this.getPlayersCountText(table) }</Text>
            </TouchableOpacity>
        )
    }

    searchGames = () => {
        if (this.state.query || this.state.query === '') {
            const query = this.state.query || null;
            this.setState({ query: null, isLoading: true });
            getUserToken().then(token => {  
                getTables(token, query).then(
                    result => {
                        let tables = [];
                        if (result.isSuccess) {
                            tables = result.tables || [];
                        }
                        else {
                            alert('There was a problem searching tables.');
                        }
                        this.setState({ tables, isLoading: false });
                    },
                    () => {
                        this.setState({ isLoading: false });  
                        alert('There was a problem searching tables.');   
                    }
                )
            });
        }
    }
    setQuery = (query) => {
        this.setState({ query, queryText: query });
    }
    
    goToCreateTable = () => {
        const { navigate } = this.props.navigation;
        navigate('TableCreate');
    }

    render() {
        return (
            <View style={styles.container}>
                <PokerGiverButton 
                    onButtonPress={() => this.goToCreateTable()} 
                    buttonTitle={'create table'}>
                </PokerGiverButton>

                <View style={styles.queryContainer}>
                    <PokerGiverText style={styles.searchLabel} textValue={'Search'}></PokerGiverText>
                    <TextInput 
                        style={styles.searchBar} 
                        value={this.state ? this.state.queryText || '' : ''}
                        onChangeText={text => this.setQuery(text)}>
                    </TextInput>
                </View>
                {
                    this.state && this.state.isLoading && 
                    <PokerGiverLoadingSpinner></PokerGiverLoadingSpinner>
                }
                { 
                    this.state && !this.state.isLoading && this.state.tables && 
                    <View style={styles.tablesListContainer}>
                        <PokerGiverText style={styles.listHeader} textValue={'touch any game below to join:'}></PokerGiverText>
                        <FlatList style={styles.tableList} data={this.state.tables} renderItem={this.renderList} /> 
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#222',
        paddingTop: 20
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
        marginLeft: 'auto',
        flex: 1
    },
    turnTimerText: {
        marginLeft: 'auto',
        flex: 1
    },
    tableNameText: {
        flex: 4
    },
    listHeader: {
        fontSize: 18,
        marginTop: 5,
        textAlign: 'center',
        marginBottom: 10
    },
    searchBar: {
        flex: 1,
        marginLeft: 5,
        backgroundColor: 'white',
        padding: 2
    },
    queryContainer: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    tablesListContainer: {
        height: '75%',
        alignItems: 'center',
        paddingTop: 10
    },
    searchLabel: {
        fontSize: 16,
        paddingTop: 5
    }
})