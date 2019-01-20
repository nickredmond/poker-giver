import React from 'react';
import { View, Text, FlatList, Picker, StyleSheet } from 'react-native';
import { PokerGiverText } from './partial/PokerGiverText';
import { getRankings } from '../services/PlayerService';

export class Rankings extends React.Component {
    static navigationOptions = {
        title: 'Rankings'
    }

    constructor(props) {
        super(props);
        getRankings('month', 'current').then(
            rankings => {
                this.setState({ rankings, currentLeaderboard: 'currentMonth' });
            },
            () => {
                // todo: better error handling
                alert('Error fetching rankings :/');
            }
        )
    }

    renderList = ({ item: ranking }) => {
        return (
            <View style={styles.ranking}>
                <Text style={styles.rankingText}>{ranking.playerName}</Text>
                <Text style={[styles.rankingText, styles.alignRight]}>{ranking.netScore}</Text>
            </View>
        )
    }

    leaderboardChanged = (leaderboardName) => {
        this.setState({ currentLeaderboard: leaderboardName });
        let leaderboardFetch = null;

        switch (leaderboardName) {
            case 'currentMonth':
                leaderboardFetch = getRankings('month', 'current');
                break;
            case 'lastMonth':
                leaderboardFetch = getRankings('month', 'last');
                break;
            case 'currentWeek':
                leaderboardFetch = getRankings('week', 'current');
                break;
            case 'lastWeek':
                leaderboardFetch = getRankings('week', 'last');
                break;
        }

        leaderboardFetch.then(
            rankings => {
                this.setState({ rankings });
            },
            () => {
                alert('Error fetching rankings :/')
            }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <Picker
  selectedValue={this.state.language}
  style={{ height: 50, width: 100 }}
  onValueChange={(itemValue, itemIndex) => this.setState({language: itemValue})}>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</Picker> */}
                {
                    this.state && this.state.currentLeaderboard &&
                    <View style={styles.leaderboardPickerContainer}>
                        <PokerGiverText style={styles.leaderboardPickerLabel} textValue={'Leaderboard:'}>
                        </PokerGiverText>
                        <Picker
                            style={styles.leaderboardPicker}
                            selectedValue={this.state.currentLeaderboard}
                            onPress={(e)=>alert('yolo')}
                            onValueChange={value => this.leaderboardChanged(value)}>
                            <Picker.Item label="This Month" value="currentMonth" />
                            <Picker.Item label="This Week" value="currentWeek" />
                            <Picker.Item label="Last Month" value="lastMonth" />
                            <Picker.Item label="Last Week" value="lastWeek" />
                        </Picker>
                    </View>
                }

                {
                    this.state && this.state.rankings &&
                    <View style={styles.listContainer}>
                        <FlatList data={this.state.rankings} renderItem={this.renderList} />
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
        flex: 10,
        marginTop: 10
    },
    ranking: {
        backgroundColor: '#88FF88',
        marginTop: 10,
        padding: 5,
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10
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
        fontSize: 24,
        margin: 10
    },
    leaderboardPickerContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    rankingText: {
        fontSize: 18
    },
    alignRight: {
        marginLeft: 'auto'
    }
})