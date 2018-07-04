import React, {Component} from 'react';
import { PostComponent } from './PostsComponents';
import { connect } from 'react-redux';

require('../styles/Discover.css');

class DiscoverComponent extends Component {

    state = {currentCategory: '', errors: []}

    handleCategory = (e) => {
        this.setState({currentCategory: e.target.value});
    }

    reset = () => {
        this.setState({currentCategory: ''});
    }

    render(){
        if(this.state.currentCategory) return <DiscoverList filter={this.state.currentCategory} reset={this.reset} />
        else return(
            <div>
                <div className="discoverContainer">
                    <button className="btn btn-1" value="Lifestyle" onClick={this.handleCategory}>
                        Lifestyle
                    </button><br />
                    <button className="btn btn-2" value="Sport" onClick={this.handleCategory}>
                        Sport
                    </button><br />
                    <button className="btn btn-3" value="Fashion" onClick={this.handleCategory}>
                        Moda
                    </button><br />
                    <button className="btn btn-4" value="Travel" onClick={this.handleCategory}>
                        Travel
                    </button><br />
                    <button className="btn btn-5" value="IT" onClick={this.handleCategory}>
                        IT
                    </button><br />
                    <button className="btn btn-5" value="Music" onClick={this.handleCategory}>
                        Muzyka
                    </button>
                    <br/><br/>
                </div>
            </div>
        );

    }
}

class DiscoverList extends React.Component{
    
    state = {data: []}

    getData(){
        fetch(`http://127.0.0.1:8001/api/posts/?category=${this.props.filter}`,{
            method: 'GET',
            headers:{
                'Authorization': `JWT ${this.props.token}`
            }
        }).then(res => res.json())
        .then(json => {this.setState({data: json})}).catch((err) => {this.setState({errors: err})})
        }

    componentDidMount(){
        this.getData();
    }

    render(){
        if(!this.state.data) return (<div>ŁADOWANIE</div>);
        else if(this.state.errors) return <h2>{this.state.errors}</h2>
        else return(<div className="content">
                    <h3>Posty z kategorii {this.props.filter}</h3><br/>
                    <button className="btn" onClick={this.props.reset}>Wróć</button><br/>
                    {this.state.data.map(item => <PostComponent key={item.id} data={item} />)}
                    </div>);
    }
}

DiscoverComponent.defaultProps = {
};

const mapStateToProps = (state) => {
    return {token: state.user.token}
}

DiscoverList = connect(mapStateToProps, null)(DiscoverList)

export default DiscoverComponent;
