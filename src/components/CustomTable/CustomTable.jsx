/* eslint-disable react/prop-types */
import React from "react";
import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { ReactTabulator } from "react-tabulator"; // for React 15.x, use import { React15Tabulator }

// import { Table } from "reactstrap";

class CustomTable extends React.Component {
  render() {
    const options = {
      height: 300
    };
    return (
      <ReactTabulator
        columns={this.props.header}
        data={this.props.body}
        options={options}
        responsiveLayout="true"
        footerElement={this.props.footer}
      />
    );
  }
}

export default CustomTable;
