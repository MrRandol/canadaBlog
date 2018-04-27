import React, { Component } from 'react';

import { Row, Input } from 'react-materialize'

class Waypoint extends Component {

  render() {
    var feature_name = this.props.feature.get("name")

    return (
      <Row>
        <Input 
          s={6} 
          label="Waypoint name" 
          defaultValue={feature_name} 
          onChange={(e, value) => {this.props.feature.set("name", value)}}
        />
      </Row>
    );
  }
}

export default Waypoint;
