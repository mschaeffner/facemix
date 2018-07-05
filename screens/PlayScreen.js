import React from 'react'
import { StyleSheet, View, PanResponder, Animated, Image, Dimensions } from 'react-native'
import Header from '../components/Header'
import DraggableImage from '../components/DraggableImage'

const MATRIX_SIZE = 3

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
  return arr
}

export default class PlayScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tiles: shuffle(this.props.tiles)
    }
  }

  move(index, direction) {
    const tiles = this.state.tiles
    const uri = tiles[index]

    switch (direction) {
      case 'UP':
        tiles[index - 1] = uri
        break
      case 'DOWN':
        tiles[index + 1] = uri
        break
      case 'LEFT':
        tiles[index - MATRIX_SIZE] = uri
        break
      case 'RIGHT':
        tiles[index + MATRIX_SIZE] = uri
        break
    }

    tiles[index] = null
    this.setState({tiles})
  }

  renderTile(uri, index, style) {
    if(!uri) {
      return <View key='blank' style={style} />
    }

    let allowedMove = null
    if(this.state.tiles[index - MATRIX_SIZE] === null) {
      allowedMove = 'LEFT'
    } else if(this.state.tiles[index + MATRIX_SIZE] === null) {
      allowedMove = 'RIGHT'
    } else if(this.state.tiles[index - 1] === null) {
      allowedMove = 'UP'
    } else if(this.state.tiles[index + 1] === null) {
      allowedMove = 'DOWN'
    }

    return (
      <DraggableImage
        key={uri}
        source={{uri}}
        style={style}
        allowedMove={allowedMove}
        onMove={(direction) => this.move(index, direction)}
      />
    )
  }

  render() {
    const windowWidth = Dimensions.get('window').width
    const tileStyle = {
      width: windowWidth / MATRIX_SIZE,
      height: windowWidth / MATRIX_SIZE,
      borderWidth: 1,
      borderColor: 'white'
    }

    return(
      <View style={{flex: 1}}>

        <Header onClose={() => this.props.closeScreen()} />

        <View style={{ height: windowWidth, width: windowWidth }}>
          <View style={{ flex: 1, flexDirection: 'column', flexWrap: 'wrap' }}>
            {this.state.tiles.map((tile, index) =>
              this.renderTile(tile, index, tileStyle)
            )}
          </View>
        </View>

      </View>
    )
  }
}
