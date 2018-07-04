import React from 'react';
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import Navbar from './Navbar';
import PostsComponents from './PostsComponents';
import GuestComponent from './GuestComponent';
import { connect } from 'react-redux';
import { validate_token } from '../actions/userActions';
import Discover from './Discover';
import AddPost from './AddPost';
import ProfileDetails from './ProfileDetails';
import UserPresentation from './UserPresentation';

//require('normalize.css/normalize.css');
//require('styles/App.css');


class AppComponent extends React.Component {
  
  componentDidMount(){
    if(localStorage.getItem('JWToken')){
      this.props.validate(localStorage.getItem('JWTToken'));
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar/>
          <Route exact path="/" component={GuestComponent} />
          <Route path="/posts" render={() => (this.props.user?<PostsComponents />:<Redirect to="/" />)} />
          <Route path="/discover" render={() => (this.props.user?<Discover />:<Redirect to="/" />)} />
          <Route path="/new" render={() => (this.props.user && this.props.is_premium?<AddPost />:<Redirect to="/" />)} />
          <Route path="/me" render={() => (this.props.user?<ProfileDetails />:<Redirect to="/" />)} />
          <Route path="/user/:username"  component={UserPresentation} />
        </div>
      </Router>
    );
  }
}

AppComponent.defaultProps = {
};

const mapStateToProps = (state) => {
  return {user: state.user.username, token: state.user.token, is_premium: state.user.is_premium}
}

const mapDispatchToProps = (dispatch) => {
  return {
    validate: (token) => dispatch(validate_token(token))
    //loadUserFromToken: (token) => dispatch(me_from_token(token))
  }
}

AppComponent = connect(mapStateToProps, mapDispatchToProps)(AppComponent)

export default AppComponent;
