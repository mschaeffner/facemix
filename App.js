import React from 'react'
import IntroScreen from './screens/IntroScreen'
import PhotoScreen from './screens/PhotoScreen'
import PlayScreen from './screens/PlayScreen'

const SCREEN_INTRO = 1
const SCREEN_PHOTO = 2
const SCREEN_PLAY = 3

export default class App extends React.Component {

  state = {
    currentScreen: SCREEN_INTRO,
    tiles: null
  }

  onStart() {
    this.setState({
      currentScreen: SCREEN_PHOTO
    })
  }

  closeScreen() {
    this.setState({
      currentScreen: SCREEN_INTRO,
    })
  }

  handlePhotoTiles(tiles) {
    this.setState({
      currentScreen: SCREEN_PLAY,
      tiles
    })
  }

  render() {
    switch (this.state.currentScreen) {

      case SCREEN_INTRO:
        return (
          <IntroScreen
            onStart={() => this.onStart()}
          />
        )

      case SCREEN_PHOTO:
        return(
          <PhotoScreen
            closeScreen={() => this.closeScreen()}
            handlePhotoTiles={tiles => this.handlePhotoTiles(tiles)}
          />
        )

      case SCREEN_PLAY:
        return(
          <PlayScreen
            closeScreen={() => this.closeScreen()}
            tiles={this.state.tiles}
          />
        )

      default:
        return <View/>
    }
  }

}
