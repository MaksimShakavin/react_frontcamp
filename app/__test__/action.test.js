import * as actions from '../client/actions/actions'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import mockDataOfPosts from './mockDataOfPosts'


describe('actions', () => {

    it('should create an action to sort posts by selected type', () => {
        expect(actions.sortPost('releaseDate'))
            .toEqual({ type:'SORT_POSTS', sortBy: 'releaseDate' })
    });

    it('fetch posts', (done) => {
        let state = {
            storePosts: {
                    posts:[],
                    sortBy: 'releaseDate',
            }
        };
        const mockStore = configureMockStore([thunk]);
        const store = mockStore(state);
        global.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                resolve({
                    json: () =>  new Promise((res, rej) => {res(mockDataOfPosts);})
                });
            });
        });
        store.dispatch(actions.getPosts()).then(() => {
            expect(store.getActions()).toEqual([{ type: 'RECIEVE_POSTS', posts: mockDataOfPosts }]);
            done();
        });
    });
});
