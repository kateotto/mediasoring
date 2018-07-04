import React from 'react';
import Modal from './Modal';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
require('../styles/GuestComponent.css');



class GuestComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { modalLoginIsOpen: false, modalRegisterIsOpen: false };
  }

  toggleModalLogin = () => {
    this.setState({ modalLoginIsOpen: !this.state.modalLoginIsOpen });
  }

  toggleModalRegister = () => {
    this.setState({ modalRegisterIsOpen: !this.state.modalRegisterIsOpen });
  }

  render() {
    return (
      <div  className="content">
        <div className="guestPage">
          <span>
            <a>Witaj!</a><br />
            <a>Jesteś niezalogowany!</a><br />
            <a>Zaloguj się albo zarejestruj, żeby korzystać ze strony.</a><br />
            <button id="loginBtn" onClick={this.toggleModalLogin}>Zaloguj się</button>
            <button id="joinBtn" onClick={this.toggleModalRegister}> Załóż konto</button>
          </span>
        </div>

        <Modal show={this.state.modalLoginIsOpen} onClose={this.toggleModalLogin}>
          <LoginForm />
        </Modal>
                
        <Modal show={this.state.modalRegisterIsOpen} onClose={this.toggleModalRegister}>
          <RegisterForm />
        </Modal>
      </div>
    );
  }
}

GuestComponent.defaultProps = {
};

export default GuestComponent;
