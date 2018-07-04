import React from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../actions/userActions';
import { connect } from 'react-redux';

class LoginForm extends React.Component{

  constructor(props) {
    super(props);

    this.state = {login: '', passwd: '', islogin: false}
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.login(this.state.login, this.state.passwd);
  }

  handleLoginChange = (event) => {
    this.setState({login: event.target.value});
  }

  handlePasswdChange = (event) => {
    this.setState({passwd: event.target.value});
  }

  render(){
    if(this.props.user.username && this.props.user.token) return <Redirect to="/posts" />

    const layoutStyle = {
      maxWidth: '100%'
  };
    
    return (
      <form onSubmit={this.handleSubmit} method="POST">
        <p>{this.props.user.error}</p>
        <span>LOGIN </span><br/>
        <input type="text" onChange={this.handleLoginChange} name="login" style={layoutStyle}/> <br/><br/>
        <span>HASŁO </span><br/>
        <input type="password" onChange={this.handlePasswdChange} name="password" style={layoutStyle} /><br/><br/>
        <input type="submit" value="Zaloguj" style={layoutStyle}/><br/>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {...state}
}

const mapDispatchToProps = (dispatch) => {
  return {
    login: (username, password) => dispatch(login(username,password))
  }
}

LoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm);

export default LoginForm;
