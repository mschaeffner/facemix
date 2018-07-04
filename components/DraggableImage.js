import React, { Component } from 'react'
import { StyleSheet, View, Text, PanResponder, Animated, Image } from 'react-native'

export default class DraggableImage extends Component {

  constructor(props) {
    super(props)

    this.state = {
      pan: new Animated.ValueXY()
    }

    this._val = {x:0, y:0}
    this.state.pan.addListener(value => this._val = value)

    this.panResponder = PanResponder.create({

        onStartShouldSetPanResponder: () => this.props.allowedMove !== null,

        onPanResponderGrant: _ => {
          this.state.pan.setOffset({
            x: this._val.x,
            y: this._val.y
          })
          this.state.pan.setValue({x:0, y:0})
        },

        onPanResponderMove: (event, gesture) => {

          const max = this.props.style.width

          if(this.props.allowedMove === 'LEFT') {
            gesture.dy = 0
            if(gesture.dx > 0) gesture.dx = 0
            if(gesture.dx < -max) gesture.dx = -max
          }

          if(this.props.allowedMove === 'RIGHT') {
            gesture.dy = 0
            if(gesture.dx < 0) gesture.dx = 0
            if(gesture.dx > max) gesture.dx = max
          }

          if(this.props.allowedMove === 'DOWN') {
            gesture.dx = 0
            if(gesture.dy < 0) gesture.dy = 0
            if(gesture.dy > max) gesture.dy = max
          }

          if(this.props.allowedMove === 'UP') {
            gesture.dx = 0
            if(gesture.dy > 0) gesture.dy = 0
            if(gesture.dy < -max) gesture.dy = -max
          }

          Animated.event([null, {
            dx: this.state.pan.x,
            dy: this.state.pan.y,
          }])(event, gesture)
        },

        onPanResponderRelease: (_, gesture) => {
          this._val = {x:0, y:0}
          this.state.pan.setOffset({x: 0, y: 0})
          this.state.pan.setValue({x:0, y:0})

          const threshold = this.props.style.width / 2
          if(gesture.dx > threshold) {
            this.props.onMove('RIGHT')
          } else if(gesture.dx < -1 * threshold) {
            this.props.onMove('LEFT')
          } else if(gesture.dy > threshold) {
            this.props.onMove('DOWN')
          } else if(gesture.dy < -1 * threshold) {
            this.props.onMove('UP')
          }
        }

      })

  }

  render() {
    const panStyle = { transform: this.state.pan.getTranslateTransform() }
    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[panStyle, this.props.style]}
      >
        <Image source={this.props.source} style={this.props.style} />
      </Animated.View>
    )
  }
}
