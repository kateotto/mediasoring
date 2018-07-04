import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

require('../styles/Heart.css');


class HeartComponent extends React.Component {
  
    constructor(props) {
        super(props);

        this.state = {
            likes: this.props.likes.length,
            likeFromUser: this.props.likes.includes(this.props.user_id)
        }
    }

    clicked = () => {
        if(this.state.likeFromUser){
            this.sendLike();
            this.setState({likeFromUser: !this.state.likeFromUser, likes: this.state.likes - 1})
        }
        else{
            this.sendLike();
            this.setState({likeFromUser: !this.state.likeFromUser, likes: this.state.likes + 1})
        }
    }

    sendLike = () => {
        fetch('http://127.0.0.1:8001/api/posts/like',{
            method: 'POST',
            body: JSON.stringify({id: parseInt(this.props.post_id, 10)}),
            headers:
            {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${this.props.token}`
            }
            })
    }

    render() {
      return (<HeartDisplay clicked={this.clicked} likeFromUser={this.state.likeFromUser} likes={this.state.likes}/>);
    }
  }
  
  HeartComponent.defaultProps = {
  };

  class HeartDisplay extends React.Component{
      render(){
          return(
            <div>
                <div style={{cursor: 'pointer'}} id="LikePost" className="LikePost" onClick={this.props.clicked}>
                    {this.props.likeFromUser?<div className="heart"></div>:<span>Polub</span>}
                </div><br />
                <div>{this.props.likes} lubi to</div>
            </div>
          );
      }
  }

HeartDisplay.propTypes = {
    clicked: PropTypes.func.isRequired,
    likeFromUser: PropTypes.bool.isRequired,
    likes: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
    return {token: state.user.token, user_id: state.user.id}
}

HeartComponent = connect(mapStateToProps, null)(HeartComponent);
  
export default HeartComponent;