import React from 'react';
import { Link } from 'react-router-dom';
require('../styles/navStyle.css');

class NavbarComponent extends React.Component {
    render() {
      return (
        <div className="navContener">
            <nav>
             <Link to="/posts" style={{textDecoration: 'none'}}>  <span className="Mediasoring">MS</span></Link>
               {/* <input type="text" placeholder="&#x1F50D; Szukaj" className="searchInput"/> */}
            </nav>
        </div>
    )}
}

NavbarComponent.defaultProps = {
};

export default NavbarComponent;

export class MenuElement extends React.Component{
    render(){
        return (<li><a href={this.props.link}>{this.props.name}</a></li>);
    }
}