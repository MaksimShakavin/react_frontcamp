import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from './NotFound'
import ContentPost from './ContentPost'
import ContentAddPost from './ContentAddPost'

const Content = () => (
        <Switch>
            <Route path='/add' component={ContentAddPost}/>
            <Route path='/' component={ContentPost}/>
            <Route path='*' component={ContentPost}/>
        </Switch>
);

export default Content;
