import React from 'react';
import SideMenu from './SideMenu';
import ProfileBlock from './ProfileBlock';
import { connect } from 'react-redux';
import FollowButton from './FollowButton';

import '../styles/UserPresentation.css';
//require('../styles/UserPresentation.css');

class UserPresentationComponent extends React.Component {

    state = {
        user: '',
        errors: '',
        loading: true
    }

    getUserData = () => {
        fetch(`http://127.0.0.1:8001/api/users/${this.props.match.params.username}/`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => { if(res.status !== 200){this.setState({errors: res.status})} return res.json()})
        .then(json => {this.setState({user: json, loading: false})})
        .catch(err => {this.setState({errors: err, loading: false})})
    }

    componentDidMount() {  this.getUserData(); }

    render() {
      if(this.state.errors) return (<h1>Error {this.state.errors}</h1>);
      else if(this.state.loading) return (<h1>Loading</h1>);
      return (
        <div id="contentInfluenceProfil">
            {this.props.user?<SideMenu/>:''}
            {this.props.user?<ProfileBlock/>:''}
            <div className="user_inf">
                <img src={this.state.user.avatar} className="influenceAvatar" alt="user_avatar" />
                <div>
                <h1 className="user_login">@{this.state.user.username}</h1>
                <p id="first_last_name">{this.state.user.first_name} {this.state.user.last_name}</p>
                </div>
                <FollowButton profile_id={this.state.user.id} followers={this.state.user.followers} />
               <div id="user_about">
                <div className="user_about">
              <fieldset> <legend>O MNIE</legend>{this.state.user.about}</fieldset>
                </div>
                </div>
            </div>
        </div>
    )}
}

UserPresentationComponent.defaultProps = {
};

const mapStateToProps = (state) => {
    return {user: state.user.username, user_id: state.user.id}
}

UserPresentationComponent = connect(mapStateToProps, null)(UserPresentationComponent)

export default UserPresentationComponent;

