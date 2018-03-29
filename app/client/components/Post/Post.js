import React from 'react';
import styles from './post.css';
import {connect} from 'react-redux';
import { removePost } from "../../actions/actions";
import {withRouter} from 'react-router-dom';
import { Link } from 'react-router-dom'

class Post extends React.Component{
    constructor(props){
        super(props);

    }

    render(){
        const info = this.props.info;
        return (
            <article className="poster">
                <h3 className="title">{info.title}</h3>
                <input type="button" value="Delete" className="delete-button-post" 
                onClick={() => {this.props.fetchRemovePosts(info.id)}}/>
                <p className="description">{info.description}</p>
                <div className="post-inform">
                    <span className="data">{info.releaseDate}</span>
                    <span className="author">{info.author}</span>
                </div>
            </article>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      fetchRemovePosts: (id) => {
          dispatch(removePost(id))
      }
  };
}

export default withRouter(connect(null,mapDispatchToProps)(Post));;
