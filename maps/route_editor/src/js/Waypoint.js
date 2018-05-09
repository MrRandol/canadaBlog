import React, { Component } from 'react';

import { Row, Input, Button } from 'react-materialize'

import {handleFeatureAction} from './olUtils.js'

class Waypoint extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDeleting: false
    }
  }

  startDeletion() {
    this.setState({isDeleting: true})
  }

  cancelDelete() {
    this.setState({isDeleting: false})
  }

  doDelete() {
    handleFeatureAction("DELETE", this.props.feature, {layer: this.props.layer})
  }

  changeIndex(new_index) {
    handleFeatureAction("UPDATE_INDEX", this.props.feature, {features: this.props.layer.getSource().getFeatures(), new_index: new_index})
  }

  render() {

    var features_length = this.props.layer.getSource().getFeatures().length
    var feature_name = this.props.feature.get("name")
    var feature_description = this.props.feature.get("description")

    return (
      <Row>
        <Input 
          s={6} 
          label="Waypoint name" 
          defaultValue={feature_name} 
          onChange={(e, value) => {this.props.feature.set("name", value)}}
        />
        <Input 
          type="number" 
          label="Index"
          min="0" 
          max={features_length} 
          defaultValue={this.props.feature.get("index")}
          onChange={(e, value) => {this.changeIndex(value)}}
        />

        <Input 
          s={12} 
          label="Waypoint description"
          type='textarea'
          defaultValue={feature_description} 
          onChange={(e, value) => {this.props.feature.set("description", value)}}
        />

        {this.state.isDeleting ? (
          <div>
            <Button 
              className="button-confirm-delete-waypoint light-green darken-2 scale-transition scale-in scale-out" 
              onClick={this.doDelete.bind(this)} 
              floating
              waves='light' 
              icon='done' 
            />
            <Button 
              className="button-cancel-delete-waypoint red darken-4 scale-transition scale-in scale-out" 
              onClick={this.cancelDelete.bind(this)} 
              floating
              waves='light' 
              icon='pan_tool'
            />
          </div>
        ) : (
          <Button 
            className="button-delete-waypoint red darken-4 scale-transition scale-in scale-out" 
            onClick={this.startDeletion.bind(this)} 
            floating 
            waves='light' 
            icon='delete' 
          />
        )}



      </Row>
    );
  }
}

export default Waypoint;
