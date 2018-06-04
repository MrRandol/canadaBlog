import React, { Component } from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Waypoint from './Waypoint'
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemClass = isDragging => (isDragging ? 'waypoint dragging' : 'waypoint');

class Route extends Component {

  constructor(props) {
    super(props);
    this.state = {
      features: [],
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  handleMouseHover(feature, isHovering) {
    this.props.waypointHoverCallback(feature, isHovering)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.features)
      return {features: props.features}
    else 
      return {features: []}
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const features = reorder(
      this.state.features,
      result.source.index,
      result.destination.index
    );

    var item
    for (var i=0; i<features.length; i++) {
      item = features[i]
      item.set("index", i+1)
    }

    this.setState({
      features,
    });
  }

  render() {

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} className="route-list" >
              {this.state.features.map((feature, index) => (
                <Draggable key={feature.get("name")} draggableId={feature.get("name")} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={getItemClass(snapshot.isDragging)}
                      onMouseEnter={() => this.handleMouseHover(feature, true)} 
                      onMouseLeave={() => this.handleMouseHover(feature, false)} 
                    >
                      <Waypoint layer={this.props.layer} feature={feature} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default Route;
