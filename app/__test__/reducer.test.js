import postReducer from '../client/reducers/postsReducer'
import userReducer from '../client/reducers/userReducer'
import mockDataPosts from './mockDataOfPosts'

describe('posts reducer', () => {
    it('should return the initial state', () => {
        expect(postReducer(undefined, {})).toEqual(
            {
                posts: [],
                sortBy: 'releaseDate'
            }
        )
    });

    it('should handle RECIEVE_POSTS and return correct data', () => {
        expect(postReducer({}, {
                type: 'RECIEVE_POSTS',
                posts: mockDataPosts ,
            })
        ).toEqual(
            {"posts": mockDataPosts  }
        );
    });

    it('should handle SORT_POSTS', () => {
        expect(
            postReducer([], {
                type: "SORT_POSTS",
                sortBy: 'author'
            })
        ).toEqual(
            {
                sortBy: 'author',
            })
    });
});

