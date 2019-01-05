import React from 'react';
import  Canvas  from 'react-native-canvas';
import { View, StyleSheet, Dimensions, WebView } from 'react-native';

import { drawTableBackground } from '../services/TableService';

export class Table extends React.Component {
    constructor(props) {
        super(props);
        this.tableWebView = null;

        const interval = setInterval(() => {
            if (this.tableWebView) {
                const data = {
                    players: [
                        {
                            name: 'Big Nick',
                            numberOfChips: 17206
                        },
                        {
                            name: 'Long John 23',
                            numberOfChips: 5002
                        },
                        {
                            name: 'Kat Zeta Jo',
                            numberOfChips: 99000
                        },
                        {
                            name: 'xlitl9078',
                            numberOfChips: 12154
                        },
                        {
                            name: 'Every Time !',
                            numberOfChips: 7798
                        },
                        {
                            name: 'legolas 8989',
                            numberOfChips: 4200
                        },
                        {
                            name: 'waterchess',
                            numberOfChips: 998
                        },
                        {
                            name: 'once upon me',
                            numberOfChips: 23412
                        }
                    ]
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
    }
})