import React from 'react';
import  Canvas  from 'react-native-canvas';
import { View, TouchableOpacity, Button, Text, StyleSheet, Dimensions, WebView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Modal from 'react-native-modal';

import { drawTableBackground } from '../services/TableService';

var self;
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
        this.state = { player, gameId, isModalVisible: false };

        // {
        //     id: 'b3c1b8a9-9fdd-4a82-a12a-750542629b77',
        //     name: 'Nick Redmond'
        // }
        // game id '73bf5cc7-70e3-4ed2-8766-8a2e47e6fc2a'

        const interval = setInterval(() => {
            if (this.tableWebView) {
                const data = { player, gameId }
                this.tableWebView.postMessage(JSON.stringify(data));
                clearInterval(interval);
            }
        }, 1000);
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    }

    render() {
        //const availableChipsCount = ;

        return (
            <View style={styles.container}>
                {/* <Canvas ref={this.draw} style={styles.canvas} /> */}
                <Modal isVisible={this.state.isModalVisible}>
                    <View style={styles.addChipsModal}>
                        <Text>Available Chips: { this.state.player ? this.state.player.numberOfChips || 0 : 0 }</Text>
                        <Button onPress={() => this.toggleModal()} title={'Buy In'}></Button>
                    </View>
                </Modal>
                <WebView 
                    style={styles.canvas} source={require('../webViews/table.webview.html')} 
                    // injectedJavaScript={`
                    //     window.players = [
                    //         {
                    //             name: 'Big Nick 123'
                    //         }
                    //     ];
                    // `}
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
        padding: 22
    }
})