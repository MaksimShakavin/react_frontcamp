import React from 'react';
import {connect} from 'react-redux';
import {sortPost} from "../../actions/actions";
import './resultBox.css';

class ResultSortBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedSort: 'releaseDate'
        };
    }

    render(){
        return (
            <div className="sort-part">
                <p className="count-posts">{this.props.countPosts ?
                    this.props.countPosts === 1 ? "Only one post found" : this.props.countPosts + " posts found"
                    : "No posts found"}</p>
                <div className="radios-as-text">
                    <p className="sort-by-title">Sort by</p>
                    <div>
                        <input type="radio" name="sortBy" id="releaseDate" checked={this.props.selectedSort==='releaseDate'} onChange={this.props.handleSortChange}/>
                        <label htmlFor="releaseDate">release data</label>
                    </div>
                    <div>
                        <input type="radio" name="sortBy" id="author" checked={this.props.selectedSort==='author'} onChange={this.props.handleSortChange}/>
                        <label htmlFor="author">author</label>
                    </div>
                </div>
             </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        countPosts: store.storePosts.posts.length,
        selectedSort: store.storePosts.sortBy
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSortChange: (changeEvent) => {
            dispatch(sortPost(changeEvent.target.id))

        },
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(ResultSortBox);
