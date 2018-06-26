import React from 'react'
import { Text, View, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Camera, Permissions, ImageManipulator } from 'expo'

const MATRIX_SIZE = 3

export default class App extends React.Component {

  state = {
    hasCameraPermission: null
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermission: status === 'granted',
      photos: null
    })
  }

  async cropPhotoToTile(photo, row, col) {
    const dim = (photo.width < photo.height) ? photo.width : photo.height
    const tileDim = dim / MATRIX_SIZE

    const offsetX = (photo.width > photo.height) ? (photo.width - photo.height) / 2 : 0
    const offsetY = (photo.width < photo.height) ? (photo.height - photo.width) / 2 : 0

    const cropConfig = {
      originX: tileDim * row + offsetX,
      originY: tileDim * col + offsetY,
      width: tileDim,
      height: tileDim
    }

    const result = await ImageManipulator.manipulate(
      photo.uri,
      [
        { flip: { horizontal: true } },
        { crop: cropConfig },
      ],
      { format: 'png' }
    )

    return result
  }

  async snap() {
    if (this.camera) {
      const photo = await this.camera.takePictureAsync({ exif: true })

      const photos = []
      for (let row = 0; row < MATRIX_SIZE; row++) {
        photos.push([])
        for (let col = 0; col < MATRIX_SIZE; col++) {
          const tiledPhoto = await this.cropPhotoToTile(photo, row, col)
          photos[row].push(tiledPhoto)
        }
      }

      this.setState({ photos })
    }
  }

  render() {
    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else if (this.state.photos) {

      const tileWidth = Dimensions.get('window').width / MATRIX_SIZE
      const tileStyle = {
        width: tileWidth,
        height: tileWidth,
        borderWidth: 1,
        borderColor: '#FFF'
      }

      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
          {this.state.photos.map((row, index) =>
            <View key={index} style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
              {row.map(photo =>
                <Image key={photo.uri} source={{uri: photo.uri}} style={tileStyle} />
              )}
            </View>
          )}
        </View>
      )


    } else {
      return (
        <View style={{ flex: 1 }}>

          <TouchableOpacity style={{height: 100}} onPress={() => this.snap()}>
            <Text>SNAP</Text>
          </TouchableOpacity>

          <Camera
            style={{ flex: 1 }}
            type={Camera.Constants.Type.front}
            ref={ref => this.camera = ref }
          />
        </View>
      )
    }
  }
}
