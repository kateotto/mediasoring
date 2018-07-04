import React from 'react';
//import ProfileBlock from './ProfileBlock';
require('../styles/SideMenu.css');
require('../styles/ProfileBlock.css');


class SideMenuComponent extends React.Component {

  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    document.getElementById('userBlck_cont').style.visibility = 'visible';
  }

  render() {
    return (
      <div>
          <div className="toggleButton"  onClick={this.handleClick}>
            <span className="toggleButtonContainer" role="img" aria-labelledby="options">&#x270d;</span>
          </div>
      </div>
    );
  }
}
  
SideMenuComponent.defaultProps = {
};
  
export default SideMenuComponent;