import React from 'react'
import { StyleSheet, View, PanResponder, Animated, Image, Dimensions } from 'react-native'
import Header from '../components/Header'
import DraggableImage from '../components/DraggableImage'

export default class PlayScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      tiles: this.props.tiles
    }
  }

  move(row, col, direction) {
    const tiles = this.state.tiles
    const uri = tiles[row][col].uri

    switch (direction) {
      case 'LEFT':
        tiles[row][col-1].uri = uri
        break
      case 'RIGHT':
        tiles[row][col+1].uri = uri
        break
      case 'UP':
        tiles[row-1][col].uri = uri
        break
      case 'DOWN':
        tiles[row+1][col].uri = uri
        break
    }

    tiles[row][col].uri = null
    this.setState({tiles})
  }

  renderTile(uri, style, row, col) {
    if(!uri) {
      return <View key='blank' style={style} />
    }

    const max = this.state.tiles.length - 1
    let allowedMove = null
    if(row > 0 && this.state.tiles[row-1][col].uri === null) {
      allowedMove = 'UP'
    } else if(row < max && this.state.tiles[row+1][col].uri === null) {
      allowedMove = 'DOWN'
    } else if(col > 0 && this.state.tiles[row][col-1].uri === null) {
      allowedMove = 'LEFT'
    } else if(col < max && this.state.tiles[row][col+1].uri === null) {
      allowedMove = 'RIGHT'
    }

    return (
      <DraggableImage
        key={uri}
        source={{uri}}
        style={style}
        allowedMove={allowedMove}
        onMove={(direction) => this.move(row, col, direction)}
      />
    )
  }

  render() {
    const windowWidth = Dimensions.get('window').width
    const tileStyle = {
      width: windowWidth / this.state.tiles.length,
      height: windowWidth / this.state.tiles.length,
      borderWidth: 1,
      borderColor: '#FFF'
    }

    return(
      <View style={{flex: 1}}>

        <Header onClose={() => this.props.closeScreen()} />

        <View>

          <View style={{ height: windowWidth, width: windowWidth }}>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              {this.state.tiles.map((row, i) =>
                <View key={i} style={{ flex: 1, flexDirection: 'row' }}>
                  {row.map((tile, j) => this.renderTile(tile.uri, tileStyle, i, j))}
                </View>
              )}
            </View>
          </View>


        </View>

      </View>
    )
  }
}
