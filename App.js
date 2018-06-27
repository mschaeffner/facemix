import React from 'react'
import { Text, View, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Camera, Permissions, ImageManipulator } from 'expo'
import Header from './components/Header'
import cropPhotoToTiles from './util/cropPhotoToTiles'


const MATRIX_SIZE = 3

export default class App extends React.Component {

  state = {
    hasCameraPermission: null
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted',
      tiles: null
    })
  }

  async snap() {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({ exif: true })
      const tiles = await cropPhotoToTiles(photo, MATRIX_SIZE)
      this.setState({ tiles })
    }
  }

  render() {
    const windowWidth = Dimensions.get('window').width

    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else if (this.state.tiles) {

      const tileStyle = {
        width: windowWidth / MATRIX_SIZE,
        height: windowWidth / MATRIX_SIZE,
        borderWidth: 1,
        borderColor: '#FFF'
      }

      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
          {this.state.tiles.map((row, index) =>
            <View key={index} style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
              {row.map(tile =>
                <Image key={tile.uri} source={{uri: tile.uri}} style={tileStyle} />
              )}
            </View>
          )}
        </View>
      )


    } else {
      return (
        <View style={{ flex: 1 }}>

          <Header />

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Camera
              style={{ height: windowWidth, width: windowWidth }}
              type={Camera.Constants.Type.front}
              ref={ref => this.camera = ref }
            />
          </View>

          <View style={{ height: 64, backgroundColor: 'red' }}>
            <TouchableOpacity style={{height: 64}} onPress={() => this.snap()}>
              <Text>SNAP</Text>
            </TouchableOpacity>
          </View>

        </View>
      )
    }
  }
}
