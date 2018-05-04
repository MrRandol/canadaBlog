import React, { Component } from 'react';
import { Collapsible, CollapsibleItem } from 'react-materialize'

import {featureSortingFunction} from './olUtils.js'

import Waypoint from './Waypoint'

class Route extends Component {

  constructor(props) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
  }

  handleMouseHover(feature, isHovering) {
    this.props.waypointHoverCallback(feature, isHovering)
  }

  render() {
    var features = this.props.layer ? this.props.layer.getSource().getFeatures().sort(featureSortingFunction) : []
    const listItems = features.map((feature) =>
      <CollapsibleItem 
        onMouseEnter={() => this.handleMouseHover(feature, true)} 
        onMouseLeave={() => this.handleMouseHover(feature, false)} 
        key={"feature_" + feature.get("index")} 
        header={feature.get("index") + "/ " + feature.get("name")}>
        <Waypoint layer={this.props.layer} feature={feature} />
      </CollapsibleItem>
    );

    return (
      <Collapsible popout accordion>
        {listItems}
      </Collapsible>
    );
  }
}

export default Route;
