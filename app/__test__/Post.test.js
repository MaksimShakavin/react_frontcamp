import React from 'react';
import { mount, shallow } from 'enzyme';
import { Link, BrowserRouter} from 'react-router-dom';
import { Provider } from "react-redux";
import Post from '../client/components/Post/Post';
import renderer from 'react-test-renderer';

import data from './mockOnePostData';
import storeConstructor from '../client/store';

const store = storeConstructor({});

describe('Post', () => {
  let blogPost;

  beforeAll(() => {
    blogPost = mount(
        <BrowserRouter>
          <Provider store={store}>
                <Post info ={data} key={data.id}/>
          </Provider>
        </BrowserRouter>
    );
    debugger;
    console.log('blogPost', <Post info ={data}/> );
  })

  it('has correct title', () => {
    debugger;
    expect(blogPost.find('.poster h3').first().text())
        .toEqual("React Design Principles");
  });

  it('has correct description', () => {

    expect(blogPost.find('.description').text())
        .toEqual("Thriller Thriller Thriller Thriller Thriller");
  });

  it('has correct release date', () => {

    expect(blogPost.find('.post-inform span').first().text())
      .toEqual("2015");
  });

  it('has correct author name', () => {
    
        expect(blogPost.find('.post-inform span').last().text())
          .toEqual("Dan Abramov");
      });

  it('matches snapshot for components Post', () =>{
    const tree = renderer.create(
      <BrowserRouter>
      <Provider store={store}>
            <Post info ={data} key={data.id}/>
      </Provider>
    </BrowserRouter>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
  
})