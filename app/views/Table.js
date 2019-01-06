import React from 'react';
import  Canvas  from 'react-native-canvas';
import { View, TouchableOpacity, Button, Text, StyleSheet, Dimensions, WebView } from 'react-native';
import { Entypo } from '@expo/vector-icons';

import { drawTableBackground } from '../services/TableService';

export class Table extends React.Component {
    static navigationOptions = {
        headerTitle: (<View>
            <Text>poker</Text>
            <Text>giver</Text>
        </View>),
        headerRight: (
            <Button 
                onPress={() => alert('This is a button!')}
                title="+ Add Chips"
                />
        )
    };

    constructor(props) {
        super(props);
        this.tableWebView = null;

        const interval = setInterval(() => {
            if (this.tableWebView) {
                const data = {
                    player: {
                        id: 'b3c1b8a9-9fdd-4a82-a12a-750542629b77',
                        name: 'Nick Redmond'
                    },
                    gameId: '73bf5cc7-70e3-4ed2-8766-8a2e47e6fc2a'
                }
                this.tableWebView.postMessage(JSON.stringify(data));
                clearInterval(interval);
            }
        }, 1000);
    }

    postMessage(view) {
        if (view.postMessage.length !== 1) {
            setTimeout(function() {
                this.postMessage();
            }, 100);
          } else {
            view.postMessage('Bridge is ready and WebView can now successfully receive messages.');
          }
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Canvas ref={this.draw} style={styles.canvas} /> */}
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
    }
})