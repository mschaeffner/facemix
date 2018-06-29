import React from 'react'
import { View, Image, Dimensions } from 'react-native'
import Header from '../components/Header'

export default class PlayScreen extends React.Component {

  render() {
    const windowWidth = Dimensions.get('window').width
    const tileStyle = {
      width: windowWidth / this.props.tiles.length,
      height: windowWidth / this.props.tiles.length,
      borderWidth: 1,
      borderColor: '#FFF'
    }

    return(
      <View style={{flex: 1}}>

        <Header onClose={() => this.props.closeScreen()} />

        <View>

          <View style={{ height: windowWidth, width: windowWidth }}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              {this.props.tiles.map((row, index) =>
                <View key={index} style={{ flex: 1, flexDirection: 'column' }}>
                  {row.map(tile =>
                    <Image key={tile.uri} source={{uri: tile.uri}} style={tileStyle} />
                  )}
                </View>
              )}
            </View>
          </View>


        </View>

      </View>
    )
  }
}
