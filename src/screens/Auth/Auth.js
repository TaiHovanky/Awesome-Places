import React, { Component } from 'react';
import { View, Text, Button, TextInput,
    StyleSheet, ImageBackground, Dimensions, 
    KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import backgroundImage from '../../../assets/background.jpg';
import ButtonWithBackground from '../../components/UI/Button/ButtonWithBackground';
import validate from '../../utility/validation';
import { tryAuth, authAutoSignin } from '../../store/actions/index';

class AuthScreen extends Component {
    state = {
        viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
        authMode: "login",
        controls: {
            email: {
                value: "",
                valid: false,
                validationRules: {
                    isEmail: true
                },
                touched: false
            },
            password: {
                value: "",
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: "",
                valid: false,
                validationRules: {
                    equalTo: "password"
                },
                touched: false
            }
        }
    }

    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles)
    }

    componentWillUnmount () {
        Dimensions.removeEventListener('change', this.updateStyles)
    }

    componentDidMount () {
        this.props.onAutoSignIn();
    }

    updateStyles = (dims) => {
        this.setState({
            viewMode: dims.window.height > 500 ? 'portrait' : 'landscape'
        })
    }

    authHandler = () => {
        const authData = {
            email: this.state.controls.email.value,
            password: this.state.controls.password.value,
            confirmPassword: this.state.controls.confirmPassword.value
        };

        this.props.onTryAuth(authData, this.state.authMode);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {
                authMode: prevState.authMode === 'login' ? 'signup' : 'login'
            }
        })
    }

    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const equalControl = this.state.controls[key].validationRules.equalTo;
            const equalValue = this.state.controls[equalControl].value;

            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            }
        }
        if (key === 'password') {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            }
        } //this is to help fix case where Password is changed and Confirm Password wasn't (but its 'valid' property was true)
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid: key === 'password' ? validate(prevState.controls.confirmPassword.value, prevState.controls.confirmPassword.validationRules, connectedValue) :
                            prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(value, prevState.controls[key].validationRules, connectedValue),
                        touched: true
                    }
                }
            }
        }, () => console.log(this.state.controls))
    }

    render () {
        let headingText = null;
        let confirmPasswordControl = null;

        let submitButton = (
            <ButtonWithBackground
                color="#29aaf4"
                onPress={this.authHandler}
                // disabled={(!this.state.controls.confirmPassword.valid && this.state.authMode === 'signup') ||
                //     !this.state.controls.email.valid ||
                //     !this.state.controls.password.valid
                // }
            >
                Submit
            </ButtonWithBackground>
        );

        if (this.props.isLoading) {
            submitButton = <ActivityIndicator />
        }

        if (this.state.authMode === 'signup') {
            confirmPasswordControl = (
                <View style={this.state.viewMode === 'portrait' ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper}>
                    <DefaultInput 
                        valid={this.state.controls.confirmPassword.valid}
                        placeholder="Confirm Password" 
                        style={styles.input}
                        value={this.state.controls.confirmPassword.value}
                        onChangeText={(val) => this.updateInputState('confirmPassword', val)}
                        touched={this.state.controls.confirmPassword.touched}
                        secureTextEntry
                    />
                </View>
            );
        }

        if (this.state.viewMode === 'portrait') {
            headingText = (
                <MainText>
                    <HeadingText style={{color: "white"}}>Please Log In</HeadingText>
                </MainText>
            );
        }
        return (
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    {headingText}
                    <ButtonWithBackground
                        color="#29aaf4"
                        onPress={this.switchAuthModeHandler}
                    >
                        Switch to {this.state.authMode === 'login' ? 'Sign Up' : 'Log In'}
                    </ButtonWithBackground>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inputContainer}>
                            <DefaultInput 
                                valid={this.state.controls.email.valid}
                                placeholder="Email Address"
                                style={styles.input}
                                value={this.state.controls.email.value}
                                onChangeText={(val) => this.updateInputState('email', val)}
                                touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            <View style={(this.state.viewMode === 'portrait' || this.state.authMode === 'login') ?
                                styles.portraitPasswordContainer : styles.landscapePasswordContainer}
                            >
                                <View style={(this.state.viewMode === 'portrait' || this.state.authMode === 'login') ?
                                    styles.portraitPasswordContainer : styles.landscapePasswordContainer}
                                >
                                    <DefaultInput
                                        valid={this.state.controls.password.valid}
                                        placeholder="Password"
                                        style={styles.input}
                                        value={this.state.controls.password.value}
                                        onChangeText={(val) => this.updateInputState('password', val)}
                                        touched={this.state.controls.password.touched}
                                        secureTextEntry
                                    />
                                </View>
                            </View>
                            {confirmPasswordControl}
                        </View>
                    </TouchableWithoutFeedback>
                    {submitButton}
                </KeyboardAvoidingView>
            </ImageBackground>
       );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    backgroundImage: {
        width: "100%",
        flex: 1
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        backgroundColor: "#eeeeee",
        borderColor: "#bbb"
    },
    landscapePasswordContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    portraitPasswordContainer: {
        flexDirection: "column",
        justifyContent: "space-between"
    },
    landscapePasswordWrapper: {
        width: "45%"
    },
    portraitPasswordWrapper: {
        width: "100%"
    }
});

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
        onAutoSignIn: () => dispatch(authAutoSignin())
    }
}

export default connect(null, mapDispatchToProps)(AuthScreen);