import React from 'react'
import { View, Dimensions } from 'react-native'
import { Text } from 'react-native-elements'
import { Camera, Permissions } from 'expo'
import cropPhotoToTiles from '../util/cropPhotoToTiles'
import Header from '../components/Header'
import Button from '../components/Button'

const MATRIX_SIZE = 3

export default class PhotoScreen extends React.Component {

  state = {
    hasCameraPermission: null
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted'
    })
  }

  async takePhoto() {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({ exif: true })
      const tiles = await cropPhotoToTiles(photo, MATRIX_SIZE)
      this.props.handlePhotoTiles(tiles)
    }
  }

  render() {
    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      const windowWidth = Dimensions.get('window').width
      return (
        <View style={{flex: 1}}>

          <Header onClose={() => this.props.closeScreen()} />

          <Camera
            style={{ height: windowWidth, width: windowWidth }}
            type={Camera.Constants.Type.front}
            ref={ref => this.camera = ref }
          />

          <View style={{paddingTop: 25}}>
            <Button
              title='Snap'
              onPress={() => this.takePhoto()}
            />
          </View>

        </View>
      )
    }
  }

}
