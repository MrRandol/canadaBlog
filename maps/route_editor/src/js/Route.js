import React, { Component } from 'react';
import { Collapsible, CollapsibleItem } from 'react-materialize'

class Route extends Component {

  init() {

  }

  render() {
    const listItems = this.props.features.map((feature) =>
      <CollapsibleItem key={"feature_" + feature.get("index")} header={feature.get("index") + "/ " + feature.get("name")}>
        Lorem ipsum dolor sit amet.
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
