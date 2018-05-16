import React, { Component } from 'react';
import { Button, Text, View, Image, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import { deletePlace } from '../../store/actions/index';

class placeDetail extends Component {
    placeDeletedHandler = () => {
        this.props.onDeletePlace(this.props.selectedPlace.key);
        this.props.navigator.pop();
    }

    render () {
        console.log('this props', this.props.selectedPlace)
        const deltas = {
            latitudeDelta: 0.0122,
            longitudeDelta: Dimensions.get("window").width / Dimensions.get("window").height * 0.0122
        }
        return (
            <View style={styles.container}>
                <View>
                    <Image source={this.props.selectedPlace ? this.props.selectedPlace.image : null} style={styles.placeImage}  />
                    <Text style={styles.placeName}>{this.props.selectedPlace ? this.props.selectedPlace.name : null}</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={this.placeDeletedHandler}>
                        <View style={styles.deleteButton}>
                            <Icon 
                                size={30}
                                name={Platform.OS === "android" ? "md-trash" : "ios-trash"}
                                color="red"
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <MapView
                    style={styles.map}
                    initialRegion={Object.assign({}, this.props.selectedPlace.location, deltas)}
                >
                    <MapView.Marker coordinate={this.props.selectedPlace.location} />
                </MapView>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        margin: 22
    },
    placeImage: {
        width: "100%",
        height: 200
    },
    placeName: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 28
    },
    deleteButton: {
        alignItems: "center"
    },
    map: {
        width: "100%",
        height: 250
    }
})

const mapDispatchToProps = dispatch => {
    return {
        onDeletePlace: (key) => dispatch(deletePlace(key))
    }
}

export default connect(null, mapDispatchToProps)(placeDetail);