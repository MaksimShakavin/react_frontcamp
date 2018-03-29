import React from 'react';
import Post from '../Post/Post';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getPosts} from "../../actions/actions";
import styles from'./content.css';
 

// const BlogAPI = {
//     posts: [
//         {number: 1, title: "Ben Blocker", description: "Comedies Comedies Comedies Comedies", releaseDate: "2014", author: "Quentin Tarantino"},
//         {number: 2, title: "Dave Defend", description: "Dramas Dramas Dramas Dramas Dramas", releaseDate: "2015", author: "Quentin Tarantino"},
//         {number: 3, title: "Sam Sweeper", description: "Dramas Dramas Dramas Dramas Dramas Dramas", releaseDate: "2014", author: "Quentin Tarantino"},
//         {number: 4, title: "Matt Midfiel", description: "Thriller Thriller Thriller Thriller Thriller", releaseDate: "2015", author: "Big Dealan"},
//         {number: 5, title: "Will Winger", description: "Thriller Thriller Thriller Thriller Thriller", releaseDate: "2014", author: "Big Dealan"},
//         {number: 6, title: "Fillipe Forw", description: "Comedies Comedies Comedies Comedies", releaseDate: "2016", author: "Big Dealan"},
//         {number: 7, title: "William Win", description: "Thriller Thriller Thriller Thriller Thriller", releaseDate: "2017", author: "Gvinet Paltrou"},
//         {number: 8, title: "Fil Forward", description: "Comedies Comedies Comedies Comedies", releaseDate: "2016", author: "Gvinet Paltrou"}
//     ],
//     all: function() { return this.posts},
//     get: function(id) {
//         const isPost = p => p.number === id;
//         return this.posts.find(isPost)
//     }
// };

class ContentPost extends React.Component{

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.requestPosts();
    }

    requestPosts(){
        this.props.fetchPosts();
    }

    sortPostsBy (sortBy, posts){
        if(sortBy === "releaseDate") {
            posts.sort(function (a, b) {
                const itemA = a.releaseDate || '0';
                const itemB = b.releaseDate || '0';
                return itemB.replace(/-/g, '')
                    - itemA.replace(/-/g, '');
            });
        }else {
            posts.sort(function (a, b) {
                return a.author.localeCompare(b.author);
            });
        }
        return posts;
    }

    render(){
        console.log(this.props.state);
        let posts = this.sortPostsBy(this.props.sortBy, this.props.posts);
        return (
            <div className="content">
                {
                    posts.map(p => (
                        <Post info={p} key={p.id} />
                    ))
                }
            </div>
        );
    }
}

const mapStateToProps = function(store) {
    return {
        posts: store.storePosts.posts,
        sortBy: store.storePosts.sortBy, 
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
      fetchPosts: () => {
          dispatch(getPosts())
      }
  };
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ContentPost));