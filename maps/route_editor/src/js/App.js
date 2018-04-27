import React, { Component } from 'react';

import Route from './Route'
import {createMap} from './olUtils.js'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      features: []
    }
  }

  componentDidMount() {
    var drawing_route_layer = createMap()

    var drawing_source = drawing_route_layer.getSource()
    drawing_source.on('change', () => {
     this.setState({features: drawing_source.getFeatures()})
    })
  }

  render() {
    return (
      <div>
        <div className="map" id="map"></div>
        <div className="route-list">
          <Route features={this.state.features} />
        </div>
      </div>
    );
  }
}

export default App;
