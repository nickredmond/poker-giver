import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { PokerGiverText } from '../partial/PokerGiverText';
import { logIn, createUser } from '../../services/PlayerService';

export class Login extends React.Component {
    static navigationOptions = {
        header: null
    };
    static EMAIL_PATTERN = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g;

    constructor(props) {
        super(props);
        this.state = {
            isNewUser: false
        };
    }

    setNewUser = (isNewUser) => {
        this.setState({ isNewUser });
    }

    setPageError = (errorMessage) => {
        this.setState({ pageError: errorMessage })
    }
    clearPageError = () => {
        this.setState({ pageError: null });
    }

    doSignUp = () => {
        this.clearPageError();
        if (this.isFormValid()) {
            createUser(this.state.username, this.state.password, this.state.email).then(
                (response) => {
                    if (response.isSuccess) {
                        this.props.loggedIn();
                    }
                    else {
                        this.setPageError('There was a problem creating new user.');
                    }
                },
                (err) => {
                    // display appropriate errors
                }
            );
        }
    }

    doLogIn = () => {
        this.clearPageError();
        if (this.isFormValid()) {
            alert('loggin ins')
            logIn(this.state.username, this.state.password).then(
                (response) => {
                    if (response.isSuccess) {
                        this.props.loggedIn();
                    }
                    else {
                        this.setPageError('There was a problem logging in.');
                    }
                },
                (err) => {
                    // display appropriate errors
                }
            );
        }
    }

    isFormValid = () => {
        return !(this.state.usernameError || this.state.emailError || 
            this.statepasswordError || this.state.confirmPasswordError);
    }

    setUsername = (username) => {
        if (username) {
            this.setState({ username, usernameError: null });
        }
        else {
            this.setState({
                usernameError: 'Username is required.'
            }); 
        }
    }

    setEmail = (email) => {
        if (email) {
            const isValidEmail = Login.EMAIL_PATTERN.test(email);
            if (isValidEmail) {
                this.setState({ email, emailError: null });
            }
            else {
                this.setState({
                    emailError: 'Please enter valid email.'
                });
            }
        }
        else {
            this.setState({
                emailError: 'Email is required.'
            });
        }
    }

    setPassword = (password) => {
        if (password) {
            if (this.state.isNewUser) {
                const minPasswordLength = 8;
                if (password.length >= minPasswordLength) {
                    if (/[A-Za-z]/.test(password) && /[0-9]/.test(password)) {
                        this.setState({ password, passwordError: null });
                    }
                    else {
                        this.setState({
                            passwordError: 'Password must contain at least one letter and one number.'
                        })
                    }
                }
                else {
                    this.setState({
                        passwordError: 'Password must be at least ' + minPasswordLength + ' characters.'
                    });
                }
            }
        }
        else {
            this.setState({
                passwordError: 'Password is required.'
            })
        }
    }

    setConfirmPassword = (confirmPassword) => {
        if (this.state.password) {
            if (this.state.password === confirmPassword) {
                this.setState({ confirmPassword, confirmPasswordError: null });
            }
            else {
                this.setState({ confirmPasswordError: 'Password and confirm password do not match.' })
            }
        }
        else {
            this.setState({ confirmPassword, confirmPasswordError: null });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {
                    this.state.pageError && 
                    <Text style={styles.pageErrorMessage} textValue={ this.state.pageError }></Text>
                }

                <View style={styles.formGroup}>
                    <PokerGiverText style={styles.inputLabel} textValue={'username'}></PokerGiverText>
                    <TextInput style={styles.input} onChangeText={(text) => this.setUsername(text)}></TextInput>
                </View>
                {
                    this.state.usernameError && 
                    <Text style={styles.errorMessage}>{ this.state.usernameError }</Text>
                }
                
                {
                    this.state.isNewUser && 
                    <View style={styles.formGroup}>
                        <PokerGiverText style={styles.inputLabel} textValue={'email'}></PokerGiverText>
                        <TextInput style={styles.input} onChangeText={(text) => this.setEmail(text)}></TextInput>
                    </View>
                }
                {
                    (this.state.isNewUser && this.state.emailError) && 
                    <Text style={styles.errorMessage}>{ this.state.emailError }</Text>
                }

                <View style={styles.formGroup}>
                    <PokerGiverText style={styles.inputLabel} textValue={'password'}></PokerGiverText>
                    <TextInput style={styles.input} secureTextEntry={true} onChangeText={(text) => this.setPassword(text)}></TextInput>
                </View>
                {
                    this.state.passwordError && 
                    <Text style={styles.errorMessage}>{ this.state.passwordError }</Text>
                }

                {
                    this.state.isNewUser && 
                    <View style={styles.formGroup}>
                        <PokerGiverText style={styles.inputLabel} textValue={'confirm password'}></PokerGiverText>
                        <TextInput style={styles.input} secureTextEntry={true} onChangeText={(text) => this.setConfirmPassword(text)}></TextInput>
                    </View>
                }
                {
                    (this.state.isNewUser && this.state.confirmPasswordError) && 
                    <Text style={styles.errorMessage}>{ this.state.confirmPasswordError }</Text>
                }

                {
                    this.state.isNewUser && 
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => this.doSignUp()}>
                            <Text style={styles.buttonText}>sign up</Text>
                        </TouchableOpacity>
                        <View style={styles.formFooter}>
                            <PokerGiverText style={styles.footerText} textValue={'Already have an account?'}></PokerGiverText>
                            <TouchableOpacity onPress={() => this.setNewUser(false)}>
                                <PokerGiverText style={styles.link} textValue={'log in'}></PokerGiverText>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                {
                    !this.state.isNewUser && 
                    <View>
                        <TouchableOpacity style={styles.button} onPress={() => this.doLogIn()}>
                            <Text style={styles.buttonText}>log in</Text>
                        </TouchableOpacity>
                        <View style={styles.formFooter}>
                            <PokerGiverText style={styles.footerText} textValue={'Never played before?'}></PokerGiverText>
                            <TouchableOpacity onPress={() => this.setNewUser(true)}>
                                <PokerGiverText style={styles.link} textValue={'sign up'}></PokerGiverText>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1
    },
    formGroup: {
        flexDirection: 'row',
        marginBottom: 10
    },
    errorMessage: {
        color: '#FFAAAA',
        marginBottom: 5,
        fontSize: 16
    },
    pageErrorMessage: {

    },
    formFooter: {
        marginTop: 10,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    link: {
        textDecorationLine: 'underline',
        marginLeft: 5,
        fontSize: 16
    },
    input: {
        backgroundColor: '#efefef',
        flex: 2,
        marginLeft: 10
    },
    button: {
        backgroundColor: '#88FF88',
        padding: 10,
        marginLeft: '25%',
        width: '50%',
        marginTop: 25
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 24
    },
    inputLabel: {
        fontSize: 18
    },
    footerText: {
        fontSize: 16
    }
});