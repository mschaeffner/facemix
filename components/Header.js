import React from 'react'
import { Header } from 'react-native-elements'

const titleStyle = {
  color: '#fff',
  fontWeight: '800',
  fontSize: 18
}

export default ({onClose}) => {
  if(onClose) {
    return (
      <Header
        centerComponent={{ text: 'Facemix', style: titleStyle }}
        rightComponent={{ type: 'entypo', icon: 'cross', color: '#fff', onPress:onClose }}
      />
    )
  } else {
    return (
      <Header
        centerComponent={{ text: 'Facemix', style: titleStyle }}
      />
    )
  }
}
