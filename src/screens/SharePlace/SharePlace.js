import React, { Component } from 'react';
import { View, Text, Button, TextInput, 
    ScrollView, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { addPlace } from '../../store/actions/index';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';

import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import { startAddPlace } from '../../store/actions/index';

class SharePlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    state = {
        placeName: "",
        location: {
            value: null,
            valid: false
        },
        image: {
            value: null,
            valid: false
        }
    };
    
    constructor (props) {
        super(props);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    // componentWillMount () {
    //     this.reset();
    // }

    reset = () => {
        this.setState({
            placeName: "",
            location: {
                value: null,
                valid: false
            },
            image: {
                value: null,
                valid: false
            }
        });
    }

    componentDidUpdate () {
        if (this.props.placeAdded) {
            this.props.navigator.switchToTab({ tabIndex: 0 });
            // this.props.onStartAddPlace();
        }
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                this.props.onStartAddPlace();
            }
        }
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }

    placeNameChangedHandler = val => {
        this.setState({
            placeName: val
        });
    };

    placeAddedHandler = () => {
        this.props.onAddPlace(
            this.state.placeName,
            this.state.location.value,
            this.state.image.value
        );
        this.reset();
        this.imagePicker.reset();
        this.locationPicker.reset();
    }

    locationPickedHandler = location => {
        this.setState({
            location: {
                value: location,
                valid: true
            }
        });
    }

    imagePickedHandler = image => {
        this.setState({
            image: {
                value: image,
                valid: true
            }
        });
    }
 
    render () {
        let submitButton = (
            <Button
                title="Share the Place!"
                onPress={this.placeAddedHandler}
                disabled={!this.state.placeName ||
                    !this.state.location.valid}
            />
        );
        if (this.props.isLoading) {
            submitButton = <ActivityIndicator />
        }
        return (
           <ScrollView contentContainerStyle={styles.container}>
                <MainText>
                    <HeadingText>Share a Place with us!</HeadingText>
                </MainText>
                <PickImage
                    onImagePicked={this.imagePickedHandler}
                    ref={ref => this.imagePicker = ref}
                />
                <PickLocation
                    onLocationPick={this.locationPickedHandler}
                    ref={ref => this.locationPicker = ref}
                />
                <PlaceInput
                    placeName={this.state.placeName}
                    onChangeText={this.placeNameChangedHandler}
                />
                <View style={styles.button}>
                    {submitButton}
                </View>
           </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    placeholder: {
        borderWidth: 1,
        borderColor: "black",
        backgroundColor: "#eee",
        width: "80%",
        height: 100
    },
    button: {
        margin: 8
    },
    previewImage: {
        width: "100%",
        height: "100%"
    }
})

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        placeAdded: state.places.placeAdded
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image)),
        onStartAddPlace: () => dispatch(startAddPlace())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);