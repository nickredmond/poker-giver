import React from 'react';
import {  View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Modal  from 'react-native-modal'

export class PokerGiverNumberModal extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = { inputValue: this.props.inputValuePlaceholder };
    }

    setInputValue = (text) => {
        const inputValue = parseInt(text) || 0;
        this.setState({ inputValue });
    }

    clearInputValue = () => {
        this.setState({ inputValue: '' })
    }

    cancelValue = () => {
        this.setState({
            doesValueExceedChipsCount: false,
            isZeroValue: false,
            inputValue: this.props.inputValuePlaceholder
        });
        this.props.valueCancelled();
    }

    submitValue = () => {
        const updatedState = {
            isZeroValue: false,
            doesValueExceedChipsCount: false
        }

        if (!this.state.inputValue || this.state.inputValue === this.props.inputValuePlaceholder) {
            updatedState.isZeroValue = true;
        }
        else if (this.state.inputValue > this.props.availableValue) {
            updatedState.doesValueExceedChipsCount = true;
        }
        else {
            updatedState.inputValue = this.props.inputValuePlaceholder;
            this.props.valueSubmitted(this.state.inputValue);
        }

        this.setState(updatedState);
    }

    render() {
        return (
            <Modal isVisible={this.props.isModalVisible}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{ this.props.title }</Text>
                </View>
                <View style={styles.addChipsModal}>
                    
                    <Text style={styles.availableChipsLabel}>{ this.props.message }</Text>
                    {
                        this.props.subtext && 
                        <Text style={styles.subtext}>{ this.props.subtext }</Text>
                    }
                    <View style={styles.buyInAmountContainer}>
                        <TextInput 
                            keyboardType='numeric' 
                            style={[styles.buyInAmount, styles.buyInPlaceholder]}
                            value={ this.state.inputValue }
                            onFocus={ this.clearInputValue.bind() }
                            onChangeText={(text) => this.setInputValue(text)}>
                        </TextInput>
                    </View>

                    { 
                        this.state.isZeroValue && 
                        <Text style={styles.betModalError}>Please enter amount greater than zero.</Text>
                    }
                    {
                        this.state.doesValueExceedChipsCount && 
                        <Text style={styles.betModalError}>{ this.props.amountTooLargeMessage }</Text>
                    }

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity style={styles.buttonCancel} onPress={() => this.cancelValue()}>
                            <Text style={[styles.buttonText, styles.dialogButton]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonBuyIn} onPress={() => this.submitValue()}>
                            <Text style={[styles.buttonText, styles.dialogButton]}>{ this.props.confirmText }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalHeader: {
        backgroundColor: '#555',
        paddingLeft: 10,
        paddingBottom: 10,
        paddingTop: 5
    },
    modalTitle: {
        color: 'white',
        fontSize: 18
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
    subtext: {
        fontSize: 18,
        color: '#888',
        fontStyle: 'italic',
        margin: 10,
        textAlign: 'center'
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
    betModalError: {
        color: 'red',
        fontSize: 14
    },
    buttonsRow: {
        flexDirection: 'row',
        marginTop: 10
    },
    dialogButton: {
        padding: 10
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
})