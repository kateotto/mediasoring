import React from 'react';
import { connect } from 'react-redux';
import '../styles/FollowButton.css';


class FollowButton extends React.Component{

    state = {
        follows: this.props.followers.length,
        followFromUser: this.props.followers.includes(this.props.user_id)
    }

    followUser = () => {
        fetch('http://127.0.0.1:8001/api/users/follow', {
            method: 'POST',
            body: JSON.stringify({'user_to': this.props.profile_id}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${this.props.token}`
            }
        })
    }

    clicked = () => {
        if(this.state.followFromUser){
            this.followUser();
            this.setState({followFromUser: !this.state.followFromUser, follows: this.state.follows - 1})
        }
        else{
            this.followUser();
            this.setState({followFromUser: !this.state.followFromUser, follows: this.state.follows + 1})
        }
    }

    render(){
        return (
            <div>
                <span>Obserwujący: {this.state.follows}</span><br/>
                {this.state.followFromUser?
                <button id="UnfollowUser" onClick={this.clicked}>OBSERWUJESZ</button>:
                this.props.user_id && this.props.user_id !== this.props.profile_id?
                <button id="FollowUser" onClick={this.clicked}>OBSERWUJ</button>:''}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {user_id: state.user.id, token: state.user.token}
}

FollowButton = connect(mapStateToProps, null)(FollowButton);
export default FollowButton;