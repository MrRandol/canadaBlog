import React, { Component } from 'react';

import { Icon, Input, Button } from 'react-materialize'

import {handleFeatureAction} from './olUtils.js'

class Waypoint extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDeleting: false,
      collapsed: false
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
    var feature_index = this.props.feature.get("index")
    var feature_name = this.props.feature.get("name")
    var feature_description = this.props.feature.get("description")
    var form_class = this.state.collapsed ? "waypoint-form collapsed" : "waypoint-form"

    return (
      <div className="waypoint-wrapper">
        <div className="waypoint-header">
          <span className="waypoint-index">#{feature_index}</span>
          <span className="waypoint-name"> {feature_name}</span>
          <div className="waypoint-collapse" onClick={() => {this.setState({collapsed: !this.state.collapsed})}}><Icon>{ this.state.collapsed ? "arrow_drop_up" : "arrow_drop_down"}</Icon></div>
        </div>

        <div className={form_class}>

          <div className="waypoint-name-input">
            <Input 
              s={6} 
              label="Waypoint name" 
              defaultValue={feature_name} 
              onChange={(e, value) => {this.props.feature.set("name", value)}}
            />
          </div>

          <div className="waypoint-description-input">
            <Input 
              s={12} 
              label="Waypoint description"
              type='textarea'
              defaultValue={feature_description} 
              onChange={(e, value) => {this.props.feature.set("description", value)}}
            />
          </div>

          {this.state.isDeleting ? (
            <div>
              <Button 
                className="button-cancel-delete-waypoint scale-transition scale-in scale-out" 
                onClick={this.cancelDelete.bind(this)} 
                floating
                waves='light' 
                icon='cancel'
                style={{backgroundColor: "#7d0808", marginRight: "5px"}}
              />
              <Button 
                className="button-confirm-delete-waypoint light-green darken-2 scale-transition scale-in scale-out" 
                onClick={this.doDelete.bind(this)} 
                floating
                waves='light' 
                icon='done' 
              />
            </div>
          ) : (
            <Button 
              className="button-delete-waypoint scale-transition scale-in scale-out" 
              onClick={this.startDeletion.bind(this)} 
              floating 
              waves='light' 
              icon='delete' 
              style={{backgroundColor: "#7d0808"}}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Waypoint;
