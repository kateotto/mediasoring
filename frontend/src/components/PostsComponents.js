import React, { Component } from 'react';
import Heart from './Heart';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



import SideMenu from './SideMenu';
import FilterContent from './FilterContent';
import ProfileBlock from './ProfileBlock';
require('../styles/PostsComponents.css');

class PostListComponent extends Component{

    constructor()
    {
        super();
        this.state = {data: [],
                      isLoading: false,
                      errors: []
                    };
    }
    
    componentDidMount() {
            fetch('http://127.0.0.1:8001/api/posts/following',{
                method: 'GET',
                headers:{
                    'Authorization': `JWT ${this.props.token}`
                }
            }).then(res => res.json())
            .then(json => {this.setState({data: json})}).catch((err) => {this.setState({errors: err});})
            }
    
            
    render(){
        if(this.state.isLoading){
            return (
            <div>
                <FilterContent/>
                <SideMenu/>
                <ProfileBlock/>
                <h1>Ładowanie...</h1>
            </div>);
        }
        return (
            <div className="content">
                <SideMenu/>
                <FilterContent/>
                <ProfileBlock/>
                {this.state.data.map(item => <PostComponent key={item.id} data={item} />)}
            </div>
        );
    }
}


export class PostComponent extends Component{
    checkPostType = () => {
        if(!this.props.data.media) return <TextPostComponent data={this.props.data} />;
        
        let type = this.props.data.media.split('.').slice(-1)[0];
        
        if(type === 'mp4'){
            return <VideoPostComponent data={this.props.data} style={{width: '400px'}}/>
        }
        else if(type === 'jpg' || type === 'JPEG' || type === 'png'){
            return <ImagePostComponent data={this.props.data} />
        }
    }
    
    render() { return this.checkPostType(); }
}


class TextPostComponent extends Component{

    state = {likes: this.props.data.likes.length}

    render(){
        let user = this.props.data.author.username?this.props.data.author.username:''
        return (
            <div className="post">
                    <div className="post_info">
                        <div className="post_info_author">
                            <Link to={`/user/${user}`}><img src={this.props.data.author.avatar} alt="user_avatar"/></Link>
                            <p>{this.props.data.author.username}</p>
                            </div>
                        <Heart likes={this.props.data.likes} post_id={this.props.data.id}/>
                        <div className="post_info_created">
                            {this.props.data.created.split('T')[0]}
                        </div>
                        <br/>
                        <p  className="categoryPost">{this.props.data.category}</p>
                    </div>
                    <div className="post_content">
                        <p className="postName">{this.props.data.title}</p>
                        <div>
                            <p>{this.props.data.description}</p>
                        </div>
                    </div>
                </div>
        );
    }
}

class ImagePostComponent extends Component{
    render(){
        let user = this.props.data.author.username?this.props.data.author.username:''
        return (
            <div className="post">
                    <div className="post_info">
                        <div className="post_info_author">
                            <Link to={`/user/${user}`}><img src={this.props.data.author.avatar} alt="user_avatar"/></Link>
                            <p>{this.props.data.author.username}</p>
                        </div>
                        <Heart likes={this.props.data.likes} post_id={this.props.data.id}/>
                        <p className="created">{this.props.data.created.split('T')[0]}</p>
                        <p>{this.props.data.category}</p>
                    </div>
                    <div className="post_content">
                        <span className="postName">{this.props.data.title}</span>
                        <div>
                            <p>{this.props.data.description}</p>
                            <div className="media_content">
                                <a href={this.props.data.media}><img src={this.props.data.media} alt="media-content"/></a>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

class VideoPostComponent extends Component{
    render(){
        let user = this.props.data.author.username?this.props.data.author.username:''
        return (
            <div className="comment">
                    <div className="comment_author_info">
                        <div>
                        <Link to={`/user/${user}`}><img src={this.props.data.author.avatar} alt="user_avatar"/></Link>
                        <p>{this.props.data.author.username}</p>
                        </div>
                        <Heart likes={this.props.data.likes} post_id={this.props.data.id}/>
                        <p className="created">{this.props.data.created.split('T')[0]}</p>
                        <p>{this.props.data.category}</p>
                    </div>
                    <div className="comment_content">
                      <p className="postName">{this.props.data.title}</p>
                        <div>
                            <p>{this.props.data.description}</p>
                            <div className="media_content">
                                <video id='player' controls>
                                    <source src={this.props.data.media} type="video/mp4" />
                                </video>
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {token: state.user.token}
}

PostListComponent = connect(mapStateToProps, null)(PostListComponent)

export default PostListComponent;
