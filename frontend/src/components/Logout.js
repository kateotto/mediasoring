import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions/userActions';
require('../styles/Logout.css');


class LogoutComponent extends React.Component{

    render(){
        return (
            <span onClick={this.props.logout} className="logoutBtn">Wyloguj</span>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout())
    }
}

LogoutComponent = connect(null, mapDispatchToProps)(LogoutComponent);
export default LogoutComponent;