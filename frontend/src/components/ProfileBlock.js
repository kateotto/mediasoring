import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import LogoutComponent from './Logout';


require('../styles/ProfileBlock.css');
require('../styles/SideMenu.css');

class ProfileBlockComponent extends React.Component {
    constructor(props){
        super(props);
        this.closeBlock = this.closeBlock.bind(this);
    }

    closeBlock(){
        document.getElementById('userBlck_cont').style.visibility = 'hidden';
    }

    render() {
        var username = 'username';
        if(this.props.user){
            username = this.props.user;
        }
        
        return(
            <div className="userBlock_content" id="userBlck_cont">
                <div className="userBlock">
                    <span id="closeCross" onClick={this.closeBlock}>&#10007;</span>
                    <div className="userAvatar">
                        <img src={this.props.avatar} alt="user_avatar" />
                    </div>
                    <div className="userLogin">
                        @{username}
                    </div>
                    <div className="premiumIcon">{this.props.is_premium?<span role="img" aria-labelledby="crown">&#128081;</span>:''}<br/></div>
                    {this.props.is_premium?
                    <Link to="/new" style={{textDecoration: 'none', color: '#fff', fontSize: '30px', position: 'relative'}}><p id="addPostLink">Dodaj post</p></Link>
                    :''}
                    <Link to="/me"style={{textDecoration: 'none', color: '#fff', fontSize: '30px', position: 'relative', top: '-3%'}}><p>Profil</p></Link>
                    <LogoutComponent />
                </div>
            </div>

        );
    }
}

ProfileBlockComponent.defaultProps = {
};

const mapStateToProps = (state) => {
    return {user: state.user.username,
            avatar: state.user.avatar,
            is_premium: state.user.is_premium,
            first_name: state.user.first_name,
            last_name: state.user.last_name}
}

ProfileBlockComponent = connect(mapStateToProps, null)(ProfileBlockComponent)

export default ProfileBlockComponent;
