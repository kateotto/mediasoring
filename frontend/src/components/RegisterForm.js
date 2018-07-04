import React from 'react';
import LoginForm from './LoginForm';


export default class RegisterForm extends React.Component{

  constructor(props) {
    super(props);

    this.state = {login: '', password1: '', password2: '', email: '', success: '', errors: {}}
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if(this.validate() !== 0) return;

    const formData = new FormData()
    formData.append('username', this.state.login)
    formData.append('email', this.state.email)
    formData.append('password1', this.state.password1)
    formData.append('password2', this.state.password2)

    fetch('http://127.0.0.1:8001/api/users/registration/', {
            method: 'POST',
            body: formData
        }).then(resp => {
            if(resp.status === 201) {this.setState({success: true});}
            else return resp.json();
        }).then(err => {
            let errors = {}
            //if('username' in err) {errors.login = err.username[0]}
            if('username' in err) {errors.login = 'Nazwa użytkownika jest już zajęta'}
            if('email' in err) {errors.email = err.email[0]; }
            Object.keys(errors).length !== 0?this.setState({errors: errors}):'';
        }).catch(err => {this.setState({errors: err})})
  }

  handleLoginChange = (event) => {
    this.setState({login: event.target.value});
  }

  handleEmailChange = (event) => {
    this.setState({email: event.target.value});
  }

  handlePasswd1Change = (event) => {
    this.setState({password1: event.target.value});
  }

  handlePasswd2Change = (event) => {
    this.setState({password2: event.target.value});
  }

  validate = () => {
    var errors = {};
    
    if (!this.state.login) {
      errors.login = 'To pole jest wymagane';
    }
    else if (this.state.login.length < 6) {
      errors.login = 'Nazwa użytkownika musi mieć conajmniej 6 znaków';
    }

    if (!this.state.password1) {
      errors.password = 'To pole jest wymagane';
    }
    else if(this.state.password1.length < 6){
      errors.password = 'Hasło nie może być krótsze niż 6 znaków';
    }

    if (this.state.password1 !== this.state.password2) {
      errors.password = 'Hasła są od siebie różne';
    }

    if (!this.state.email) {
      errors.email = 'To pole jest wymagane';
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
      errors.email = 'Niepoprawny format adresu email'
    }

    this.setState({errors: errors})
    return Object.keys(errors).length;
  }

  render(){
    if(this.state.success) {return (
      <div>
        <strong style={{color: 'green'}}>REJESTRACJA ZAKOŃCZONA POMYŚLNIE</strong><br/>
        <span>Teraz możesz się zalogować</span>
        <LoginForm />
      </div>
    );}
    else return (
        <form onSubmit={this.handleSubmit} method="POST">
            <span>LOGIN</span><br/>
            {this.state.errors.login?<span style={{color: 'red'}}>{this.state.errors.login}</span>:''}<br/>
            <input type="text" onChange={this.handleLoginChange} name="loginReg"/><br/><br/>
            <span>EMAIL</span><br/>
            {this.state.errors.email?<span style={{color: 'red'}}>{this.state.errors.email}</span>:''}<br/>
            <input type="text" onChange={this.handleEmailChange} name="emailReg"/><br/><br/>
            <span> HASŁO </span><br/>
            {this.state.errors.password?<span style={{color: 'red'}}>{this.state.errors.password}</span>:''}<br/>
            <input type="password" onChange={this.handlePasswd1Change} name="pass1Reg"/>
            <br/><br/>
            <span> POWTÓRZ HASŁO </span><br/>
            <input type="password" onChange={this.handlePasswd2Change} name="pass2Reg"/><br/><br/>
            <input type="submit" value="Rejestracja" /><br/>
        </form>
    );
  }
}