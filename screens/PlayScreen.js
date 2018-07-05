import React from 'react'
import { StyleSheet, View, PanResponder, Animated, Image, Dimensions, Text } from 'react-native'
import Header from '../components/Header'
import DraggableImage from '../components/DraggableImage'

const MATRIX_SIZE = 3

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min)

const equalArrays = (a1, a2) => {
  if(a1.length !== a2.length) {
    return false
  }
  for (let i = 0; i < a1.length; i++) {
    if(a1[i] !== a2[i]) {
      return false
    }
  }
  return true
}

const getAllowedMove = (tiles, index) => {
  if(tiles[index - MATRIX_SIZE] === null) {
    return 'LEFT'
  } else if(tiles[index + MATRIX_SIZE] === null) {
    return 'RIGHT'
  } else if(tiles[index - 1] === null) {
    return 'UP'
  } else if(tiles[index + 1] === null) {
    return 'DOWN'
  }
  return null
}

const swapTile = (tiles, index, direction) => {
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
}

export default class PlayScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tiles: [...this.props.tiles],
      solved: false
    }
  }

  componentDidMount() {
    const tiles = this.state.tiles
    for (let i = 0; i < 1000; i++) {
      const index = rand(0,9)
      const direction = getAllowedMove(tiles, index)
      if(direction) {
        swapTile(tiles, index, direction)
      }
    }
    this.setState({tiles})
  }

  move(index, direction) {
    const tiles = this.state.tiles
    swapTile(tiles, index, direction)
    const solved = equalArrays(tiles, this.props.tiles)
    this.setState({tiles, solved})
  }

  renderTile(uri, index, style) {
    if(!uri) {
      return <View key='blank' style={style} />
    }
    return (
      <DraggableImage
        key={uri}
        source={{uri}}
        style={style}
        allowedMove={getAllowedMove(this.state.tiles, index)}
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

        <View style={{paddingTop: 25}}>
          <Text>
            {this.state.solved ? 'Solved' : 'Keep going'}
          </Text>
        </View>

      </View>
    )
  }
}
