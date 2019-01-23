import React from 'react';
import { 
    View, TouchableOpacity, TouchableHighlight, Button, 
    Text, StyleSheet, Dimensions, Image,
    WebView, BackHandler } from 'react-native';
import Modal from 'react-native-modal';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import { PokerGiverNumberModal } from './partial/PokerGiverNumberModal';
import { isAuthorOfGame, getPlayerInfo, removeChips } from '../services/PlayerService';

const headerStyles = StyleSheet.create({
    backButton: {
        paddingLeft: 5
    }
})

var self; // used to reference component from within static header
export class Table extends AuthenticatedComponent {
    static navigationOptions = {
        headerLeft: (
            <TouchableHighlight style={headerStyles.backButton} onPress={() => self.backPressed()}>
                <Image 
                    source={require('../../assets/images/chevron-left.png')} 
                    style={{ width: 20, height: 20 }} />
            </TouchableHighlight>
        ),
        headerRight: (
            <Button 
                onPress={() => self.setModalVisible(true)}
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
                isAuthor: isAuthor || false
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
            player
        });
    }

    setModalVisible = (isVisible) => {
        this.setState({ isModalVisible: isVisible });
    }

    buyIn = (value) => {
        this.setModalVisible(false);
        
        if (this.tableWebView) {
            this.addChips(value);
        }
        else {
            const interval = setInterval(chipsValue => {
                if (this.tableWebView) {
                    this.addChips(chipsValue)
                    clearInterval(interval);
                }
            }, 1000, value);
        }
    }

    cancelLeaveTable = () => {
        this.setState({ isGoingBack: false });
    }
    leaveTable = () => {
        const { navigate } = this.props.navigation;
        navigate('TablesList')
    }

    getAddChipsModalMessage = () => {
        const availableChips = (this.state && this.state.player) ? this.state.player.numberOfChips || 0 : 0;
        return 'Available Chips: ' + availableChips;
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state && this.state.player && 
                    <PokerGiverNumberModal 
                        isModalVisible={this.state.isModalVisible}
                        title={'Buy In'}
                        confirmText={'Buy In'}
                        inputValuePlaceholder={'Enter buy-in amount...'}
                        message={this.getAddChipsModalMessage()}
                        amountTooLargeMessage={'Amount entered exceeds available chips.'}
                        availableValue={this.state.player.numberOfChips}
                        valueCancelled={() => this.setState({ isModalVisible: false })}
                        valueSubmitted={value => this.buyIn(value)}>
                    </PokerGiverNumberModal>
                }

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