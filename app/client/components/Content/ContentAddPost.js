import React from 'react';
import Post from '../Post/Post';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { addPost } from "../../actions/actions";
import styles from'./content.css';
 

class ContentAddPost extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            title: null,
            description: null,
            author: null,
            releaseDate: null
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    adjust_textarea(h) {
        h.style.height = "20px";
        h.style.height = (h.scrollHeight)+"px";
    }

    onSubmit (e) {
        e.preventDefault();
        console.log(this.state);
        this.props.fetchAddPost(this.state);
        this.props.history.push("/");
    }

    onChange (e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render(){
        return (
            <div className="content-add-post">
             <h2 className="create-post-title"> Create your new post</h2>
                <form  className="add-post" onSubmit={this.onSubmit}>
                    <label htmlFor="title">Enter title of the new post</label>
                    <input name="title" type="text" id="title" placeholder="Title.." 
                    onChange={this.onChange} />
                    <label htmlFor="description">Enter description of the new post</label>
                    <textarea name="description" id="description" placeholder="Description.." 
                    onChange={this.onChange}/>
                    <label htmlFor="author">Enter your name</label>
                    <input name="author" type="text" id="author" placeholder="Your name.."
                    onChange={this.onChange}/>
                    <label htmlFor="releaseDate">Enter date</label>
                    <input name="releaseDate" type="text" id="releaseDate" placeholder="Choosen date.."
                    onChange={this.onChange}/>
                    <input type="submit" value="Submit" />
                </form>    
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      fetchAddPost: (data) => {
          dispatch(addPost(data))
      }
  };
}

export default withRouter(connect(null, mapDispatchToProps)(ContentAddPost));