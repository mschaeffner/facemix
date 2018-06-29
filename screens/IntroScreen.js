import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-elements'
import Header from '../components/Header'
import Button from '../components/Button'

const steps = [
  '1) Take a photo',
  '2) It will get mixed',
  '3) Make it nice again',
]

export default class IntroScreen extends React.Component {

  render() {
    return(
      <View style={{flex: 1}}>

        <Header />

        <View>
          {steps.map((step, index) =>
            <View key={index} style={{padding: 25}}>
              <Text h3>{step}</Text>
            </View>
          )}
          <View style={{paddingTop: 25}}>
            <Button
              title='Start'
              onPress={() => this.props.onStart()}
            />
          </View>
        </View>

      </View>
    )
  }

}
