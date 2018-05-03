import React, { Component } from 'react';

import Route from './Route'

import { Button } from 'react-materialize'

import {createMap, generateKmlFromFeatures} from './olUtils.js'
import {saveRoute} from './utils.js'
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

  doSaveRoute() {
    saveRoute(generateKmlFromFeatures(this.state.features))
    .then(() => {
      window.Materialize.toast('Saved !', 4000)
    })
    .catch((e) => {
      window.Materialize.toast('Error while saving :(', 4000)
      console.log(e)
    })
  }

  render() {
    return (
      <div>
        <div className="map" id="map"></div>
        <div id="route-list">
          <Route features={this.state.features} waypointHoverCallback={this.handleToggleFeatureOver.bind(this)}/>
          <Button id="button-save" onClick={this.doSaveRoute.bind(this)} floating large className='orange accent-4' waves='light' icon='save' />
        </div>
      </div>
    );
  }
}

export default App;
