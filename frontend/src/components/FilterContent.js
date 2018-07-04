import React from 'react';
import { Link } from 'react-router-dom';
require('../styles/FilterContent.css');

const buttonStyle = {
  textDecoration: 'none',
  fontSize: '2.5rem',
  color: '#ffffff',
  //color: '#00078b',
  marginBottom:'50px',
  fontFamily: 'Lato',
  fontWeight: 900,
  borderRadius: 50,
  backgroundColor: '#0007D8'
}

class FilterContentComponent extends React.Component {
    render() {
      return (
        <div style={{paddingTop: 50}}className="linksContent">
          <Link to="/discover" style={buttonStyle}><span>ODKRYWAJ</span></Link>
        </div>
      );
    }
  }
  
  FilterContentComponent.defaultProps = {

  };
  
  export default FilterContentComponent;