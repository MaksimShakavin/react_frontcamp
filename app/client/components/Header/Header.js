import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import ResultSortBox from '../ResultBox/ResultSortBox';
import styles from './header.css';


class Header extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return (
            <header>
                <div className="header">
                    <div className="header-part">
                        <div className="fond-image"></div>
                        <h1>
                            Keep calm and add new post;)
                        </h1>
                        <Link to={`/add`}>
                            <input type="button" value="ADD" className="add-button-post"/>
                        </Link>
                    </div>
                    <div className="result-panel">
                        <ResultSortBox/>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;


