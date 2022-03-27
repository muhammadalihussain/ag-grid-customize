import React, { Component } from "react";

export default class extends Component {
  constructor(props) {
    super(props);
    this.checkedHandler = this.checkedHandler.bind(this);
  }
  checkedHandler(e) {
    let checked = e.target.checked;
    let colId = this.props.column.colId;
    this.props.node.setDataValue(colId, checked);
  }
  render() {
    return (
      <input
        type="checkbox"
        disabled
        onClick={this.checkedHandler}
        checked={this.props.value}
      />
    );
  }
}
