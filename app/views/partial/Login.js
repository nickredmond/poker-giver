import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
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
                        // navigate to tables
                    }
                    else {
                        // todo: better error handling, just set error on page
                        alert('Problem creating user.');
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
            logIn(this.state.username, this.state.password).then(
                (response) => {
                    if (response.isSuccess) {
                        // navigate to tables
                    }
                    else {
                        // todo: better error handling, just set error on page
                        alert('Problem logging in.');
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
            const isValidEmail = EMAIL_PATTERN.test(email);
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
                if (password.length > minPasswordLength) {
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
        if (password) {
            if (password === confirmPassword) {
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
                <Text>poker giver</Text>

                {
                    this.state.pageError && 
                    <Text style={styles.pageErrorMessage}>{ this.state.pageError }</Text>
                }

                <View style={styles.formGroup}>
                    <Text>Username</Text>
                    <TextInput onChangeText={(text) => this.setUsername(text)}></TextInput>
                </View>
                {
                    this.state.usernameError && 
                    <Text style={styles.errorMessage}>{ this.state.usernameError }</Text>
                }
                
                {
                    this.state.isNewUser && 
                    <View style={styles.formGroup}>
                        <Text>Email</Text>
                        <TextInput onChangeText={(text) => this.setEmail(text)}></TextInput>
                    </View>
                }
                {
                    (this.state.isNewUser && this.state.emailError) && 
                    <Text style={styles.errorMessage}>{ this.state.emailError }</Text>
                }

                <View style={sytles.formGroup}>
                    <Text>Password</Text>
                    <TextInput onChangeText={(text) => this.setPassword(text)}></TextInput>
                </View>
                {
                    this.state.passwordError && 
                    <Text style={styles.errorMessage}>{ this.state.passwordError }</Text>
                }

                {
                    this.state.isNewUser && 
                    <View style={styles.formGroup}>
                        <Text>Confirm Password</Text>
                        <TextInput onChangeText={(text) => this.setConfirmPassword(text)}></TextInput>
                    </View>
                }
                {
                    (this.state.isNewUser && this.state.confirmPasswordError) && 
                    <Text style={styles.errorMessage}>{ this.state.confirmPasswordError }</Text>
                }

                {
                    this.state.isNewUser && 
                    <View>
                        <TouchableOpacity onPress={() => this.doSignUp()}>
                            <Text>Sign Up</Text>
                        </TouchableOpacity>
                        <View style={styles.formFooter}>
                            <Text>Already have an account?</Text>
                            <Text style={styles.link} onPress={() => this.setNewUser(false)}>Log In</Text>
                        </View>
                    </View>
                }
                {
                    !this.state.isNewUser && 
                    <View>
                        <TouchableOpacity onPress={() => this.doLogIn()}>
                            <Text>Log In</Text>
                        </TouchableOpacity>
                        <View style={styles.formFooter}>
                            <Text>Never played before?</Text>
                            <Text style={styles.link} onPress={() => this.setNewUser(true)}>Sign Up</Text>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {

    },
    formGroup: {
        flexDirection: 'row'
    },
    errorMessage: {

    },
    pageErrorMessage: {

    },
    formFooter: {
        flexDirection: 'row'
    },
    link: {
        // underline
    }
});