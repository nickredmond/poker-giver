import React from 'react';
import { View, Button, Text, TextInput, StyleSheet } from 'react-native';
import { PokerGiverText } from './partial/PokerGiverText';
import { PokerGiverButton } from './partial/PokerGiverButton';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { createTable } from '../services/TableService';
import { getUserToken } from '../services/PlayerService';

export class TableCreate extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'Create Table'
    };

    constructor(props) {
        super(props);
        this.state = {
            numberOfPlayers: 2,
            numberOfAiPlayers: 0
        };
    }

    checkAiPlayersWarning = (numberOfAiPlayers) => {
        const aiPlayersWarning = numberOfAiPlayers > 0 ? 
            'NOTE: You will only earn 25% credit if any AI players are in the game.' :
            null;
        this.setState({ aiPlayersWarning });
    }

    incrementPlayers = () => {
        this.setState({ numberOfPlayers: this.state.numberOfPlayers + 1 });
    }
    decrementPlayers = () => {
        this.setState({ numberOfPlayers: this.state.numberOfPlayers - 1 });
    }
    incrementAiPlayers = () => {
        const numberOfAiPlayers = this.state.numberOfAiPlayers + 1;
        this.setState({ numberOfAiPlayers });
        this.checkAiPlayersWarning(numberOfAiPlayers);
    }
    decrementAiPlayers = () => {
        const numberOfAiPlayers = this.state.numberOfAiPlayers - 1;
        this.setState({ numberOfAiPlayers });
        this.checkAiPlayersWarning(numberOfAiPlayers);
    }

    unknownErrorReturned = () => {
        this.setState({ pageErrorMessage: 'There was a problem creating your table.' });
    }

    createGame = () => {
        this.setState({ pageErrorMessage: null });
        if (this.state.tableName) {
            const tableName = this.state.tableName;

            getUserToken().then(token => {
                const table = {
                    name: tableName,
                    numberOfPlayers: this.state.numberOfPlayers,
                    numberOfAiPlayers: this.state.numberOfAiPlayers
                };
                createTable(table, token).then(
                    result => {
                        if (result.isSuccess) {
                            const { navigate } = this.props.navigation;
                            navigate('Table', { 
                                tableName, 
                                gameId: result.gameId,
                                isAuthor: true
                            });
                        }
                        else if (result.isNameTaken) {
                            this.setState({ nameError: 'Table with that name already exists.' });
                        }
                        else {
                            this.unknownErrorReturned();
                        }
                    },
                    () => {
                        this.unknownErrorReturned();
                    }
                );
            })
        }
        else {
            this.setState({ nameError: 'Name is required.' });
        }
    }
 
    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.pageError && 
                    <Text style={styles.pageErrorMessage}>{ this.state.pageError }</Text>
                }
                {
                    this.state.aiPlayersWarning && 
                    <View style={styles.alertWarning}>
                        <Text style={styles.alertWarningText}>{ this.state.aiPlayersWarning }</Text>
                    </View>
                }

                <View style={styles.formGroup}>
                    <PokerGiverText textValue={'Name'}></PokerGiverText>
                    <TextInput 
                        onPress={() => this.setState({ nameError: null })} 
                        onChangeText={(text) => this.setState({ tableName: text })}
                        style={styles.input}>
                    </TextInput>
                </View>
                {
                    this.state.nameError && 
                    <Text style={styles.errorMessage}>{ this.state.nameError }</Text>
                }
                <View style={styles.numberFormGroup}>
                    <PokerGiverText textValue={'# Players'}></PokerGiverText>
                    <View style={styles.numberChanger}>
                        {
                            this.state.numberOfPlayers > 2 && this.state.numberOfPlayers > this.state.numberOfAiPlayers + 1 &&
                            <Button onPress={() => this.decrementPlayers()} title='  -  '></Button>
                        }
                        <PokerGiverText 
                            textValue={this.state.numberOfPlayers}
                            style={styles.playersCountText}>
                        </PokerGiverText>
                        {
                            this.state.numberOfPlayers < 8 && 
                            <Button onPress={() => this.incrementPlayers()} title='  +  '></Button>
                        }
                    </View>
                </View>
                <View style={[styles.numberFormGroup, styles.aiFormGroup]}>
                    <PokerGiverText textValue={'# AI Players'}></PokerGiverText>
                    <View style={styles.numberChanger}>
                        {
                            this.state.numberOfAiPlayers > 0 &&
                            <Button onPress={() => this.decrementAiPlayers()} title='  -  '></Button>
                        }
                        <PokerGiverText 
                            textValue={this.state.numberOfAiPlayers}
                            style={styles.playersCountText}>
                        </PokerGiverText>
                        {
                            this.state.numberOfAiPlayers < this.state.numberOfPlayers - 1 &&
                            <Button onPress={() => this.incrementAiPlayers()} title='  +  '></Button>
                        }
                    </View>
                </View>
                <PokerGiverButton 
                    onButtonPress={() => this.createGame()} 
                    buttonTitle={'create'}>
                </PokerGiverButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#222',
        padding: 15
    },
    formGroup: {
        flexDirection: 'row',
        marginBottom: 10
    },
    numberFormGroup: {
        marginBottom: 10
    },
    numberChanger: {
        flexDirection: 'row'
    },
    input: {
        backgroundColor: '#efefef',
        flex: 2,
        marginLeft: 10
    },
    errorMessage: {
        color: '#FFAAAA',
        marginBottom: 5,
        fontSize: 16
    },
    pageErrorMessage: {
        color: '#721c24',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f8d7da',
        borderWidth: 2,
        borderColor: '#f5c6cb',
        borderRadius: 3,
        textAlign: 'center'
    },
    playersCountText: {
        fontSize: 28,
        paddingLeft: 25,
        paddingRight: 25
    },
    aiFormGroup: {
        paddingBottom: 20
    },
    alertWarning: {
        borderColor: '#faf2cc',
        backgroundColor: '#fcf8e3',
        borderRadius: 3,
        borderWidth: 2,
        padding: 5,
        marginBottom: 10
    },
    alertWarningText: {
        color: '#8a6d3b',
        fontSize: 18
    }
});