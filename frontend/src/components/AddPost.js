import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import '../styles/AddPost.css';

//require('../styles/AddPost.css');


const validateForm = (values) => {
    const errors = {status: false}
    if (!values.title) {
        errors.title = 'To pole nie może być puste.';
        errors.status = true;
    } else if (values.title.length > 60) {
        errors.title = `To pole może zawierać 60 znaków lub mniej. (teraz: ${values.title.length})`;
        errors.status = true;
    }

    if (!values.category) {
        errors.category = 'Nie wybrano poprawnej kategori';
        errors.status = true;
    }

    if(!values.description && !values.media){
        errors.content = 'Nie można wstawiać pustego postu, dodaj treść lub media';
        errors.status = true;
    }

    return errors
}

class AddPostComponent extends Component {

    

    state = {
        media: null,
        title: '',
        description: '',
        category: null,
        success: false,
        errors: null
        }

    fileChangedHandler = (e) => {
        this.setState({media: e.target.files[0]})
    }

    titleHandler = (e) => {
        this.setState({title: e.target.value})
    }

    descriptionHandler = (e) => {
        this.setState({description: e.target.value}
        )
    }

    categoryHandler = (e) => {
        this.setState({category: e.target.value})
    }

    addPostRequest = (e) => {
        e.preventDefault();
        const errors = validateForm({title: this.state.title,
                                     category: this.state.category,
                                     description: this.state.description,
                                     media: this.state.media});

        if(errors.status){
            this.setState({errors: errors});
            return;
        }

        const formData = new FormData()
        if(this.state.media){
            formData.append('media', this.state.media, this.state.media.name)
        }
        formData.append('title', this.state.title)
        formData.append('description', this.state.description)
        formData.append('category', this.state.category)


        axios({url: 'http://127.0.0.1:8001/api/posts/',
            method: 'POST',
            headers: { 'Authorization': `JWT ${this.props.token}` },
            data: formData
        }).then(resp => {
            if(resp.status === 201) { this.setState({success: true})}
        }).catch(err => {this.setState({errors: err.response.data})});
    }

    render(){
        if(this.state.success) return <Redirect to="/posts" />
        return(
            <div className="addPostBody">
               <form className="addPostContainer" onSubmit={this.addPostRequest}>
                    <br/>

                    {this.state.errors && 'title' in this.state.errors?<strong>{this.state.errors.title}</strong>:''}
                    <input type="text" name="addPostTitle" placeholder="Tytuł" onChange={this.titleHandler}/>
                    <br/>
                    <textarea placeholder="Dodaj swój wpis!" rows="20" cols="50" maxLength="1000" onChange={this.descriptionHandler}>
                    </textarea><br/><br/>
                    <div id="countChars">Pozostałe znaki: {1000 - this.state.description.length}</div>
                    <br/>
                    <br/>
                    {this.state.errors && 'content' in this.state.errors?<strong>{this.state.errors.content}</strong>:''}
                    <label htmlFor="file-upload" className="custom-file-upload">
                         Dodaj plik
                         <input id="file-upload" type="file" onChange={this.fileChangedHandler}/>
                    </label>{this.state.media?this.state.media.name:''}<br/><br/>

                    {this.state.errors && 'category' in this.state.errors?<strong>Nie wybrano poprawnej kategorii</strong>:''}

                    <select name="postCategory" onChange={this.categoryHandler}>
                        <option>----</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Sport">Sport</option>
                        <option value="Fashion">Moda</option>
                        <option value="Travel">Podróże</option>
                        <option value="IT">IT</option>
                        <option value="Music">Muzyka</option>
                    </select><br/><br/>
                    <input type="submit"/>
                </form>
                
            </div>
        );

    }
}

AddPostComponent.defaultProps = {
};

const mapStateToProps = (state) => {
    return {token: state.user.token}
}

AddPostComponent = connect(mapStateToProps, null)(AddPostComponent);

export default AddPostComponent;
