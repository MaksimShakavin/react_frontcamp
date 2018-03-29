import React from 'react';
import './content.css';

class NotFound extends React.Component{
    render(){
        return (
            <div className="content">
                <p className="not-found-post">
                    No post found
                </p>
            </div>
        );
    }
}

export default NotFound;
