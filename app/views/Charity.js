import React from 'react';
import { View, Image, ScrollView, Linking, StyleSheet } from 'react-native';
import { PokerGiverText } from './partial/PokerGiverText';
import { PokerGiverButton } from './partial/PokerGiverButton';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent'; 
import { CharityNavigatorAttribution } from './partial/CharityNavigatorAttribution';
import { PokerGiverNumberModal } from './partial/PokerGiverNumberModal';
import { PokerGiverLoadingSpinner } from './partial/PokerGiverLoadingSpinner';
import { makeDonation } from '../services/PlayerService';
import { StackActions, NavigationActions } from 'react-navigation';

export class Charity extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'Charity Info'
    }

    constructor(props) {
        super(props);
        const { navigation } = this.props;
        const charity = navigation.getParam('charity');
        const availableBalance = navigation.getParam('availableBalance');
        this.state = { charity, availableBalance, isModalVisible: false };
    }

    goToCharitySite = (siteUrl) => {
        Linking.openURL(siteUrl);
    }

    getDonationModalMessage = () => {
        const availableBalance = this.state.availableBalance || 0;
        return 'Available Balance: $' + availableBalance;
    }

    submitDonation = (donationValue) => {
        this.setState({ 
            isModalVisible: false,
            isDonationProcessing: true
        })
        makeDonation(donationValue, this.state.charity.name).then(
            () => {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ 
                        routeName: 'CharitySearch',
                        params: { isDonationProcessed: true }
                    })],
                  });
                  this.props.navigation.dispatch(resetAction);
            },
            () => {
                alert('There was a problem submitting your donation. :(');
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.isDonationProcessing && 
                    <PokerGiverLoadingSpinner loadingMessage={'Processing...'}>
                    </PokerGiverLoadingSpinner>
                }

                {
                    !this.state.isDonationProcessing && 
                    <View style={{ flex: 1 }}>
                        {
                            this.state && 
                            <PokerGiverNumberModal
                                isModalVisible={this.state.isModalVisible}
                                title={'Make Donation'}
                                confirmText={'Donate'}
                                inputValuePlaceholder={'Enter donation amount...'}
                                message={this.getDonationModalMessage()}
                                amountTooLargeMessage={'Amount entered exceeds available balance.'}
                                availableValue={this.state.availableBalance}
                                valueCancelled={() => this.setState({ isModalVisible: false })}
                                valueSubmitted={value => this.submitDonation(value)}>
                            </PokerGiverNumberModal>
                        }

                        <PokerGiverText style={styles.charityName} textValue={this.state.charity.name}></PokerGiverText>
                        <PokerGiverText style={styles.missionHeader} textValue={'mission:'}></PokerGiverText>
                        <ScrollView style={styles.missionTextScroller}>
                            <PokerGiverText style={styles.missionText} textValue={this.state.charity.mission}></PokerGiverText>
                        </ScrollView>
                        <View style={styles.ratingContainer}>
                            <PokerGiverText style={styles.ratingLabel} textValue={'rating:'}></PokerGiverText>
                            <Image
                                style={{ width: 100, height: 25 }}
                                source={{ uri: this.state.charity.ratingImage }}>
                            </Image>
                        </View>
                        <CharityNavigatorAttribution linkbackUrl={this.state.charity.charityNavigatorURL}></CharityNavigatorAttribution>
                        <View style={styles.buttonsContainer}>
                            <PokerGiverButton 
                                onButtonPress={() => this.goToCharitySite(this.state.charity.websiteURL)}
                                buttonTitle={'visit site'}>
                            </PokerGiverButton>
                            <PokerGiverButton 
                                onButtonPress={() => this.setState({ isModalVisible: true })}
                                buttonTitle={'donate'}>
                            </PokerGiverButton>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        paddingLeft: 15,
        paddingRight: 15
    },
    charityName: {
        fontSize: 26
    },
    missionHeader: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 5
    },
    missionText: {
        fontSize: 16
    },
    missionTextScroller: {
        flex: 1,
        padding: 5,
        borderColor: '#ababab',
        borderRadius: 2,
        borderWidth: 1
    },  
    buttonsContainer: {
        alignItems: 'center',
        marginTop: 20
    },
    ratingContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    ratingLabel: {
        fontSize: 18,
        marginRight: 5
    }
})