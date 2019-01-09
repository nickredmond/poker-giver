import React from 'react';
import  Canvas  from 'react-native-canvas';
import { 
    View, TouchableOpacity, Button, 
    Text, StyleSheet, Dimensions, 
    WebView, TextInput } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';

var self; // used to reference component from within static header
var betAmountPlaceholder = 'Enter buy-in amount...';
export class Table extends React.Component {
    static navigationOptions = {
        headerTitle: (<View>
            <Text>poker</Text>
            <Text>giver</Text>
        </View>),
        headerRight: (
            <Button 
                onPress={() => self.toggleModal()}
                title="+ Add Chips"
                />
        )
    };

    constructor(props) {
        super(props);
        self = this;
        this.tableWebView = null;

        const { navigation } = this.props;
        const player = navigation.getParam('player');
        const gameId = navigation.getParam('gameId');
        this.state = { 
            player, 
            gameId, 
            isModalVisible: true,
            betAmount: betAmountPlaceholder
        };
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

    addChips = () => {
        let data;
        if (!this.state.isBoughtIn) {
            data = { 
                player: this.state.player, 
                gameId: this.state.gameId,
                numberOfChips: this.state.betAmount
            };
        }
        else {
            data = { numberOfChips: this.state.betAmount };
        }

        // todo: save buy-in to server
        const player = this.state.player;
        player.numberOfChips -= this.state.betAmount;
        this.setState({
            isBoughtIn: true,
            player
        });

        this.tableWebView.postMessage(JSON.stringify(data));
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
            updatedState.betAmount = this.state.betAmount;
            this.toggleModal();
            
            if (this.tableWebView) {
                this.addChips();
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
    buttonsRow: {
        flexDirection: 'row',
        marginTop: 10
    },
    dialogButton: {
        padding: 10
    },
    buttonCancel: {
        backgroundColor: '#991111'
    },
    buttonBuyIn: {
        marginLeft: 10,
        backgroundColor: '#117711'
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