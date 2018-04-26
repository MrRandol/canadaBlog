import React, { Component } from 'react';


class Route extends Component {

  init() {

  }

  render() {
    const listItems = this.props.features.map((feature) =>
      <li>{feature.get("index") + "/ " + feature.get("name")}</li>
    );

    return (
      <ul>
        {listItems}
      </ul>
    );
  }
}

export default Route;
