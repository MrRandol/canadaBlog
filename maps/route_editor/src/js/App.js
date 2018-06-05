import React, { Component } from 'react';

import Route from './Route'

import { Button, Icon } from 'react-materialize'

import {createMap, generateKmlFromFeatures, featureSortingFunction} from './olUtils.js'
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
    .then((response) => {
      if (response.status === 200) {
        window.Materialize.toast('<span class="ok-toast">Saved !</span>', 4000)
      } else {
        window.Materialize.toast('<span class="ko-toast">Error while saving :(</span>', 4000)
      }
    })
    .catch((e) => {
      window.Materialize.toast('<span class="ko-toast">Error while saving :(</span>', 4000)
      console.log(e)
    })
  }

  render() {

    var layer = this.drawing_route_layer
    var features = layer ? layer.getSource().getFeatures().sort(featureSortingFunction) : []
    return (
      <div>
        <div className="map" id="map"></div>
        <div id="route-list">
          <Route layer={layer} features={features} waypointHoverCallback={this.handleToggleFeatureOver.bind(this)}/>
          <Button id="button-save" onClick={this.doSaveRoute.bind(this)} floating large waves='light' ><Icon>save</Icon><span id="button-save-text"> SAVE </span></Button>
        </div>
      </div>
    );
  }
}

export default App;
