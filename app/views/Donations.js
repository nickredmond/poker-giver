import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import moment from 'moment';
import { getDonationsInfo } from '../services/DonationService';

export class Donations extends React.Component {
    static navigationOptions = {
        title: 'Donations'
    }

    constructor(props) {
        super(props);
        this.state = {
            donations: [],
            totalDonationsAmount: 0
        };

        getDonationsInfo().then(
            donationsInfo => {
                this.setState({
                    donations: donationsInfo.donations,
                    totalDonationsAmount: donationsInfo.totalDonationsAmount
                });
            }, 
            () => {
                alert('There was a problem getting donations info.');
            }
        )
    }

    getDonationMessage = (donation) => {
        return 'Player "' + donation.playerName + '" donated $' + donation.donationAmount + 
            ' to ' + donation.charityName;
    }

    getDonationTimeText = (donationTime) => {
        return moment(donationTime).fromNow();
    }

    renderList = ({ item: donation }) => {
        return (
            <View style={styles.donationMessage}>
                <Text style={styles.donationMessageText}>{ this.getDonationMessage(donation) }</Text>
                <Text style={styles.timeAgo}>{ this.getDonationTimeText(donation.dateCreated) }</Text>
            </View>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.totalDonationsContainer}>
                    <Text style={[styles.totalDonationsTitle, styles.totalDonationsText]}>Donations Made:</Text>
                    <Text style={[styles.totalDonationsValue, styles.totalDonationsText]}>${ this.state.totalDonationsAmount }</Text>
                </View>
                <FlatList data={this.state.donations} renderItem={this.renderList}></FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#222',
        flex: 1
    },  
    totalDonationsContainer: {
        backgroundColor: '#d9edf7',
        alignSelf: 'stretch',
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        paddingBottom: 5,
        alignItems: 'center'
    },
    totalDonationsText: {
        color: '#31708f'
    },
    totalDonationsTitle: {
        fontSize: 24
    },
    totalDonationsValue: {
        fontSize: 18
    },
    donationMessage: {
        backgroundColor: '#C6FFC6',
        padding: 10,
        marginBottom: 10,
        marginLeft: '5%',
        width: '90%'
    },
    donationMessageText: {
        fontSize: 18
    },
    timeAgo: {
        marginLeft: 'auto',
        fontSize: 16,
        color: '#555'
    }
})