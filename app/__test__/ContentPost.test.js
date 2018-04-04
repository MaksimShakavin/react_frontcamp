import React from 'react';
import { mount, shallow } from 'enzyme';
import { withRouter, BrowserRouter, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import ContentPost from '../client/components/Content/ContentPost';
import Post from '../client/components/Post/Post';


import data from './mockDataOfPosts';
import storeConstructor from '../client/store';

const store = storeConstructor({});

describe('Content', () => {
    debugger;
    let content;
    beforeAll(() => {
        debugger;
        store.dispatch({
            type:'RECIEVE_POSTS',
            posts: data
        });
        debugger;
        content = mount(
            <BrowserRouter>
                <Provider store={store}>
                    <ContentPost/>
                </Provider>
            </BrowserRouter>
        );
        console.log('content', content);
    });
    debugger;
    it('render all recieved items', () => {
    debugger;
        expect(content.find(Post).length)
            .toEqual(8);

    });
})