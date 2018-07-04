import React from 'react';
import { connect } from 'react-redux';
import { about_me, updateData } from '../actions/userActions';
import SideMenu from './SideMenu';
import ProfileBlock from './ProfileBlock';

require('../styles/ProfileDetails.css');

class ProfileDetails extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            avatar: '',
            about: '',
            old_password: '',
            new_password1: '',
            new_password2: '',
            passwd_result: []
            }
    }

    firstNameHandler = (e) => {
        this.setState({first_name: e.target.value})
    }

    lastNameHandler = (e) => {
        this.setState({last_name: e.target.value}
        )
    }

    emailHandler = (e) => {
        this.setState({email: e.target.value}
        )
    }

    aboutHandler = (e) => {
        this.setState({about: e.target.value}
        )
    }

    fileChangedHandler = (e) => {
        this.setState({avatar: e.target.files[0]})
    }

    oldPasswordHandler = (e) => {
        this.setState({old_password: e.target.value})
    }

    newPassword1Handler = (e) => {
        this.setState({new_password1: e.target.value})
    }

    newPassword2Handler = (e) => {
        this.setState({new_password2: e.target.value})
    }
    
/*     updateData = (data) => {
        this.props.updateUserData(data)
    } */

    changePassword = (e) => {
        e.preventDefault();
        let form = new FormData()
        form.append('old_password', this.state.old_password)
        form.append('new_password1', this.state.new_password1)
        form.append('new_password2', this.state.new_password2)

        fetch('http://127.0.0.1:8001/api/users/me/password/change/', {
            method: 'POST',
            body: form,
            headers: {
                'Authorization': `JWT ${this.props.token}`
            }
        }).then(resp => {
            if(resp.status === 200){
                this.setState({passwd_result: 'Hasło zmieniono pomyślnie'})
            }
            else{
                this.setState({passwd_result: 'Nie udało się zmienić hasła. Sprawdź wartość pól'})
            }
        })
    }

    updateDataRequest = (e) => {
        e.preventDefault();
        let form = new FormData()

        if(this.state.first_name) form.append('first_name', this.state.first_name)
        if(this.state.last_name) form.append('last_name', this.state.last_name)
        if(this.state.email) form.append('email', this.state.email)
        if(this.state.about) form.append('about', this.state.about)
        if(this.state.avatar) form.append('avatar', this.state.avatar, this.state.avatar.name)

        if(form.has('first_name') || form.has('last_name') || form.has('email') || form.has('about') || form.has('avatar')){
            this.props.updateUserData(form)
            //this.props.getUserData();
        }
    }

    render(){
        return (
            <div id="profileDetailsContent">
                <SideMenu/>
                <ProfileBlock/>
                <div className="user_info">
                    <div className="user_info_avatar">
                        <img src={this.props.avatar} alt='user_avatar'/>
                    </div>
                    <h2>@{this.props.username}</h2>
                    <h3>{this.props.first_name} {this.props.last_name}</h3>
                    <div className="user_info_section">
                      <fieldset id="user_info_field"><legend>O MNIE</legend>{this.props.about}</fieldset>
                    </div>
                </div><br/>
                <div>
                    <form onSubmit={this.updateDataRequest}>
                        <label htmlFor="first_name" className="label">Imię:</label>
                       {/* <p className="current-data">1</p> */}
                        <input name="first_name" type="text" placeholder={this.props.first_name} onChange={this.firstNameHandler}/><br/>
                        <label htmlFor="last_name" className="label">Nazwisko:</label>
                       {/* <p className="current-data">2</p> */}
                        <input name="last_name" type="text" placeholder={this.props.last_name} onChange={this.lastNameHandler}/><br/>
                        <label htmlFor="email" className="label">E-mail:</label>
                      {/*  <p className="current-data">3</p>  */}
                        <input name="email" type="email" placeholder={this.props.email} onChange={this.emailHandler}/><br/><br/>
                        <label htmlFor="file-upload" className="custom-file-upload" id="upload-file">
                            Zdjęcie profilowe
                            <input id="file-upload" type="file" onChange={this.fileChangedHandler}/>
                        </label> {this.state.avatar?this.state.avatar.name:''}<br/><br/>
                        <label htmlFor="about" className="label">Info:</label>
                        <textarea name="about" placeholder={this.props.about} rows='15' cols='40' maxLength="440" onChange={this.aboutHandler}></textarea>
                        <br/>

                        <input type="submit" value="Aktualizuj" className="submit" />
                    </form>
                    <br/>
                    <span className="passChngText"><b>Zmiana hasła</b></span>
                    <br/>
                    <form onSubmit={this.changePassword}>
                        <p className="passwd_change_result">{this.state.passwd_result}</p>
                        <label htmlFor="old_password" className="label">Stare hasło:</label>
                        <input type="password" placeholder="Stare hasło" name="old_password" onChange={this.oldPasswordHandler} /><br/>
                        <label htmlFor="new_password" className="label">Nowe hasło:</label>
                        <input type="password" placeholder="Nowe hasło" name="new_password" onChange={this.newPassword1Handler}/><br/>
                        <label htmlFor="new_password_2" className="label">Powtórz nowe hasło:</label>
                        <input type="password" placeholder="Powtórz nowe hasło" name="new_password_2" onChange={this.newPassword2Handler}/><br/>
                        <br/>
                        <input type="submit" value="Zmien hasło" className="submit" />
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.user.username,
        first_name: state.user.first_name,
        last_name: state.user.last_name,
        email: state.user.email,
        avatar: state.user.avatar,
        is_premium: state.user.is_premium,
        token: state.user.token,
        about: state.user.about
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUserData: () => dispatch(about_me()),
        updateUserData: (data) => dispatch(updateData(data))
    }
}

ProfileDetails = connect(mapStateToProps, mapDispatchToProps)(ProfileDetails);

export default ProfileDetails;