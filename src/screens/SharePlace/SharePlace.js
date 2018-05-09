import React, { Component } from 'react';
import { View, Text, Button, TextInput, ScrollView, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { addPlace } from '../../store/actions/index';
import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';

import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';

class SharePlaceScreen extends Component {
    state = {
        placeName: ""
    };
    
    constructor (props) {
        super(props);

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
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
        console.log('this stae',  this.state)
        if(this.state.placeName.trim() === '') {
            return;
        }
        this.props.onAddPlace(this.state.placeName);
    }
 
    render () {
        return (
           <ScrollView contentContainerStyle={styles.container}>
                <MainText>
                    <HeadingText>Share a Place with us!</HeadingText>
                </MainText>
                <PickImage />
                <PickLocation />
                <PlaceInput
                    placeName={this.state.placeName}
                    onChangeText={this.placeNameChangedHandler}
                />
                <View style={styles.button}>
                    <Button title="Share the Place!" onPress={this.placeAddedHandler} />
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

const mapDispatchToProps = dispatch => {
    return {
        onAddPlace: (placeName) => dispatch(addPlace(placeName))
    }
}

export default connect(null, mapDispatchToProps)(SharePlaceScreen);