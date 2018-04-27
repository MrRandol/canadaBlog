import React, { Component } from 'react';

import Route from './Route'

import {createMap} from './olUtils.js'
import {routePlacemarkHoverStyleFunction} from './style.js'

class App extends Component {

  constructor(props) {
    super(props)
    
    this.map = null
    this.drawing_route_layer = null

    this.state = {
      features: []
    }
  }

  componentDidMount() {
    var {map, drawing_route} = createMap()

    this.map = map
    this.drawing_route_layer = drawing_route

    var drawing_source = this.drawing_route_layer.getSource()
    drawing_source.on('change', () => {
     this.setState({features: drawing_source.getFeatures()})
    })
  }

  handleToggleFeatureOver(feature, isHover) {
    if (isHover) {
      feature.setStyle((res) => routePlacemarkHoverStyleFunction(feature))
    } else {
      feature.setStyle(null)
    }
  }

  render() {
    return (
      <div>
        <div className="map" id="map"></div>
        <div id="route-list">
          <Route features={this.state.features} waypointHoverCallback={this.handleToggleFeatureOver.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default App;
