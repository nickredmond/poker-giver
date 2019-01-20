import React from 'react';
import  Canvas  from 'react-native-canvas';
import { 
    View, TouchableOpacity, TouchableHighlight, Button, 
    Text, StyleSheet, Dimensions, 
    WebView, TextInput, BackHandler } from 'react-native';
import Modal from 'react-native-modal';
import { Entypo } from '@expo/vector-icons';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { isAuthorOfGame, getPlayerInfo, removeChips } from '../services/PlayerService';

const headerStyles = StyleSheet.create({
    buttonIcon: {
        fontSize: 48,
        color: '#444',
        marginBottom: 10
    }
})

var self; // used to reference component from within static header
var betAmountPlaceholder = 'Enter buy-in amount...';
export class Table extends AuthenticatedComponent {
    static navigationOptions = {
        headerLeft: (
            <TouchableHighlight onPress={() => self.backPressed()}>
                <Entypo name='chevron-left' style={headerStyles.buttonIcon} />
            </TouchableHighlight>
        ),
        headerRight: (
            <Button 
                onPress={() => self.toggleModal()}
                title="+ Add Chips"
                />
        )
    };

    constructor(props) {
        super(props);
        this.state = {};

        self = this;
        this.tableWebView = null;

        const { navigation } = this.props;
        const gameId = navigation.getParam('gameId');
        const isAuthor = navigation.getParam('isAuthor');
        getPlayerInfo().then(playerInfo => {
            this.setState({ 
                player: playerInfo,
                gameId, 
                isModalVisible: true,
                isAuthor: isAuthor || false,
                betAmount: betAmountPlaceholder
            });
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    }

    backPressed = () => {
        this.setState({ isGoingBack: true });
        return true; // prevents navigating back automatically
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    cancelBuyIn = () => {
        this.setState({
            doesBetExceedChipsCount: false,
            isZeroBet: false,
            betAmount: betAmountPlaceholder
        });
        this.toggleModal();
    }

    addChips = (numberOfChips) => {
        let data;
        if (!this.state.isBoughtIn) {
            data = { 
                player: this.state.player, 
                gameId: this.state.gameId,
                numberOfChips
            };
        }
        else {
            data = { numberOfChips };
        }

        const player = this.state.player;
        player.numberOfChips -= numberOfChips;

        isAuthorOfGame(this.state.gameId).then(
            result => {
                removeChips(numberOfChips, result.token).then(isSuccess => {
                    if (isSuccess) {
                        data.token = result.token;
                        data.isAuthor = result.isAuthor;
                        this.tableWebView.postMessage(JSON.stringify(data));
                    }
                    else {
                        // todo: better error handling
                        alert('Error buying into table.');
                    }
                })
            },
            () => {
                // todo: better error handling
                alert('Error buying into table.');
            }
        );

        this.setState({
            isBoughtIn: true,
            betAmount: 0,
            player
        });
    }

    buyIn = () => {
        const updatedState = {
            isZeroBet: false,
            doesBetExceedChipsCount: false
        }

        if (!this.state.betAmount || this.state.betAmount === betAmountPlaceholder) {
            updatedState.isZeroBet = true;
        }
        else if (this.state.betAmount > this.state.player.numberOfChips) {
            updatedState.doesBetExceedChipsCount = true;
        }
        else {
            this.toggleModal();
            
            if (this.tableWebView) {
                this.addChips(this.state.betAmount);
            }
            else {
                const interval = setInterval(() => {
                    if (this.tableWebView) {
                        this.joinGame();
                        clearInterval(interval);
                    }
                }, 1000);
            }
        }

        this.setState(updatedState);
    }

    setBetAmount = (text) => {
        const betAmount = parseInt(text) || 0;
        this.setState({ betAmount });
    }

    clearBetAmount = () => {
        this.setState({ betAmount: '' })
    }

    cancelLeaveTable = () => {
        this.setState({ isGoingBack: false });
    }
    leaveTable = () => {
        const { navigate } = this.props.navigation;
        navigate('TablesList')
    }

    render() {
        //const availableChipsCount = ;

        return (
            <View style={styles.container}>
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Buy In</Text>
                    </View>
                    <View style={styles.addChipsModal}>
                        <Text style={styles.availableChipsLabel}>Available Chips: { this.state.player ? this.state.player.numberOfChips || 0 : 0 }</Text>
                        <View style={styles.buyInAmountContainer}>
                            <TextInput 
                                keyboardType='numeric' 
                                style={ this.state.buyInAmount ? styles.buyInAmount : [styles.buyInAmount, styles.buyInPlaceholder] }
                                value={ this.state.betAmount }
                                onFocus={ this.clearBetAmount.bind() }
                                onChangeText={(text) => this.setBetAmount(text)}>
                            </TextInput>
                        </View>

                        { 
                            this.state.isZeroBet && <Text style={styles.betModalError}>Please enter amount greater than zero.</Text>
                        }
                        {
                            this.state.doesBetExceedChipsCount && <Text style={styles.betModalError}>Amount entered exceeds available chips.</Text>
                        }

                        <View style={styles.buttonsRow}>
                            <TouchableOpacity style={styles.buttonCancel} onPress={() => this.cancelBuyIn()}>
                                <Text style={[styles.buttonText, styles.dialogButton]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonBuyIn} onPress={() => this.buyIn()}>
                                <Text style={[styles.buttonText, styles.dialogButton]}>Buy In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal isVisible={this.state.isGoingBack}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Leave Table</Text>
                    </View>
                    <View style={styles.addChipsModal}>
                        <Text style={styles.availableChipsLabel}>Are you sure you want to leave?</Text>
                        <Text style={styles.leaveTableText}>Don't worry, your chips will be refunded, besides any bets you've already placed.</Text>

                        <View style={styles.buttonsRow}>
                            <TouchableOpacity style={styles.buttonInfo} onPress={() => this.cancelLeaveTable()}>
                                <Text style={[styles.buttonText, styles.dialogButton]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonLeaveTable} onPress={() => this.leaveTable()}>
                                <Text style={[styles.buttonText, styles.dialogButton]}>Leave</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                
                <WebView 
                    style={styles.canvas} source={require('../webViews/table.webview.html')} 
                    ref={(webView) => this.tableWebView = webView} />
            </View>
        )
    }

    /** Utility, or "private", functions */

    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'black',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 100
    },
    canvas: {
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height - 100
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'blue'
    },
    header: {
        marginTop: 20
    },
    addChipsModal: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 22
    },
    availableChipsLabel: {
        fontSize: 24
    },
    leaveTableText: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10
    },  
    buttonsRow: {
        flexDirection: 'row',
        marginTop: 10
    },
    dialogButton: {
        padding: 10
    },
    buttonLeaveTable: {
        marginLeft: 10,
        backgroundColor: '#991111'
    },
    buttonBuyIn: {
        marginLeft: 10,
        backgroundColor: '#117711'
    },
    buttonInfo: {
        backgroundColor: '#0808FF'
    },
    buttonCancel: {
        backgroundColor: '#991111'
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    },
    betModalError: {
        color: 'red',
        fontSize: 14
    },
    buyInAmount: {
        fontSize: 18
    },
    buyInAmountContainer: {
        width: '80%',
        marginTop: 5,
        marginBottom: 5,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 3,
        paddingLeft: 5
    },
    buyInPlaceholder: {
        fontStyle: 'italic',
        color: '#999'
    },
    modalHeader: {
        backgroundColor: '#555',
        paddingLeft: 10,
        paddingBottom: 10,
        paddingTop: 5
    },
    modalTitle: {
        color: 'white',
        fontSize: 18
    }
})