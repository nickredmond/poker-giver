import React from 'react';
import { View, Text, FlatList, Picker, StyleSheet } from 'react-native';
import { PokerGiverText } from './partial/PokerGiverText';
import { AuthenticatedComponent } from '../shared/AuthenticatedComponent';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { PokerGiverLoadingSpinner } from './partial/PokerGiverLoadingSpinner';
import { getRankings, getPlayerName } from '../services/PlayerService';

export class Rankings extends AuthenticatedComponent {
    static navigationOptions = {
        title: 'Rankings'
    }

    constructor(props) {
        super(props);
        this.state = { 
            selectedIndex: 0,
            monthlyRankingTitle: 'this month',
            weeklyRankingTitle: 'this week'
        }
        this.leaderboardChanged('current');

        getPlayerName().then(
            playerName => {
                this.setState({ playerName });
            },
            () => {
                alert('There was a problem reading from your device.');
            }
        )
    }

    getRankingStyle = (playerName) => {
        const style = playerName === this.state.playerName ? 
            [styles.ranking, styles.highlightedRanking] : 
            [styles.ranking, styles.defaultRanking];
        return style;
    }

    renderList = ({ item: ranking }) => {
        return (
            <View style={this.getRankingStyle(ranking.playerName)}>
                {
                    ranking.winningAmount && 
                   <View style={styles.winningContainer}>
                         <Text style={[styles.winningText, styles.alignRight]}>{'$' + ranking.winningAmount}</Text>
                   </View>
                }

                <Text style={[styles.rankingText, styles.winnerName]}>{ranking.playerName}</Text>
                <Text style={[styles.rankingText, styles.alignRight]}>{ranking.netScore}</Text>
            </View>
        )
    }

    leaderboardChanged = (leaderboardName) => {
        getRankings(leaderboardName).then(
            rankingsResponse => {
                this.setState({
                    monthlyRankings: rankingsResponse.monthlyRankings,
                    weeklyRankings: rankingsResponse.weeklyRankings
                });
            },
            () => {
                alert('Error fetching rankings :/')
            }
        )
    }

    handleIndexChange = (index) => {
        const titleTimeQualifier = (index === 0) ? 'this' : 'last';
        this.setState({
          ...this.state,
          selectedIndex: index,
          monthlyRankingTitle: titleTimeQualifier + ' month',
          weeklyRankingTitle: titleTimeQualifier + ' week'
        });

        const leaderboardName = (index === 0) ? 'current' : 'previous';
        this.leaderboardChanged(leaderboardName);
      }

    render() {
        return (
            <View style={styles.container}> 
                <View style={styles.leaderboardSelectWrapperStyle}>
                    <PokerGiverText style={styles.leaderboardPickerLabel} textValue={'Leaderboard:'}>
                    </PokerGiverText>
                    <SegmentedControlTab
                        values={['current', 'previous']}
                        selectedIndex={this.state.selectedIndex}
                        onTabPress={this.handleIndexChange}
                        />
                </View>

                {
                    !(this.state.monthlyRankings && this.state.weeklyRankings) && 
                    <PokerGiverLoadingSpinner></PokerGiverLoadingSpinner>
                }

                {
                    this.state && this.state.monthlyRankings &&
                    <View style={styles.listContainer}>
                        <PokerGiverText style={styles.rankingsTitle} textValue={this.state.monthlyRankingTitle}></PokerGiverText>
                        <FlatList data={this.state.monthlyRankings} renderItem={this.renderList} />
                    </View>
                }

                {
                    this.state && this.state.weeklyRankings &&
                    <View style={styles.listContainer}>
                        <PokerGiverText style={styles.rankingsTitle} textValue={this.state.weeklyRankingTitle}></PokerGiverText>
                        <FlatList data={this.state.weeklyRankings} renderItem={this.renderList} />
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222'
    },
    listContainer: {
        flex: 1,
        marginTop: 10
    },
    ranking: {
        padding: 5,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    defaultRanking: {
        backgroundColor: '#88FF88'
    },
    highlightedRanking: {
        backgroundColor: '#C6FFC6'
    },  
    leaderboardPicker: {
        backgroundColor: '#117711',
        color: 'white',
        flex: 1,
        marginTop: 10,
        marginRight: 10
    },
    buttonIcon: {
        fontSize: 48,
        color: '#efefef'
    },
    leaderboardPickerLabel: {
        fontSize: 18,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15
    },
    rankingText: {
        fontSize: 18
    },
    alignRight: {
        marginLeft: 'auto'
    },
    winningContainer: {
        alignSelf: 'flex-start',
    },
    winningText: {
       paddingLeft: 5,
       paddingRight: 5,
       borderRadius: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#efefef',
        backgroundColor: '#339933'
    },
    winnerName: {
        marginLeft: 10
    },
    leaderboardSelectWrapperStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    rankingsTitle: {
        fontSize: 18,
        marginLeft: 10
    }
})