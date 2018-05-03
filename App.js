import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import AuthScreen from './src/screens/Auth/Auth';
import SharePlaceScreen from './src/screens/SharePlace/SharePlace';
import FindPlaceScreen from './src/screens/FindPlace/FindPlace';
import PlaceDetailScreen from './src/screens/PlaceDetail/PlaceDetail';
import SideDrawerScreen from './src/screens/SideDrawer/SideDrawer';
import configureStore from './src/store/configureStore';

const store = configureStore();

// Register screens
Navigation.registerComponent("awesome-places.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("awesome-places.SharePlaceScreen", () => SharePlaceScreen, store, Provider);
Navigation.registerComponent("awesome-places.FindPlaceScreen", () => FindPlaceScreen, store, Provider);
Navigation.registerComponent("awesome-places.PlaceDetailScreen", () => PlaceDetailScreen, store, Provider);
Navigation.registerComponent("awesome-places.SideDrawerScreen", () => SideDrawerScreen, store, Provider);

// start an app
Navigation.startSingleScreenApp({
  screen: {
    screen: "awesome-places.AuthScreen",
    title: "Login"
  }
})

// import React from 'react';
// import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
// import { connect } from 'react-redux';
// import { addPlace, deletePlace, selectPlace, deselectPlace } from './src/store/actions'
// import ListItem from './src/components/ListItem/ListItem';
// import placeImage from './assets/austin.jpg';
// import PlaceDetail from './src/components/PlaceDetail/PlaceDetail';

// class App extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       placeName: ''
//     }
//   }

//   placeNameChangedHandler = (val) => {
//     this.setState({
//       placeName: val
//     })
//   }

//   placeAddedHandler = placeName => {
//     this.props.onAddPlace(placeName);
//   }

//   placeDeletedHandler = () => {
//     this.props.onDeletePlace();
//   }

//   placesSelectedHandler = key => {
//     this.props.onSelectPlace(key);
//   }

//   modalClosedHandler = () => {
//     this.props.onDeselectPlace();
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <View style={styles.inputContainer}>
//           <PlaceDetail 
//             selectedPlace={this.props.selectedPlace}
//             onItemDeleted={this.placeDeletedHandler}
//             onModalClosed={this.modalClosedHandler}
//           />
//           <TextInput 
//             placeholder="An awesome place"
//             style={styles.placeInput}
//             value={this.props.placeName}
//             onChangeText={this.placeNameChangedHandler}
//           />
//           <Button 
//             title="Add" 
//             style={styles.placeButton}
//             onPress={() => this.placeAddedHandler(this.state.placeName)}
//           />
//         </View>

        
//         <FlatList
//           style={styles.listContainer}
//           data={this.props.places}
//           renderItem={(info) => (
//             <ListItem
//               placeName={info.item.name}
//               placeImage={info.item.image}
//               onItemPressed={() => this.placesSelectedHandler(info.item.key)}
//             />
//           )}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 26,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },
//   inputContainer: {
//     // flex: 1,
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center"
//   },
//   placeInput: {
//     width: "70%"
//   },
//   placeButton: {
//     width: "30%"
//   },
//   listContainer: {
//     width: "100%"
//   }
// });

// const mapStateToProps = state => {
//   return {
//     places: state.places.places,
//     selectedPlace: state.places.selectedPlace
//   }
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     onAddPlace: (name) => dispatch(addPlace(name)),
//     onDeletePlace: () => dispatch(deletePlace()),
//     onSelectPlace: (key) => dispatch(selectPlace(key)),
//     onDeselectPlace: () => dispatch(deselectPlace())
//   }
// };

// export default connect(mapStateToProps, mapDispatchToProps)(App);
