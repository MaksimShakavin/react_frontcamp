import React from 'react';

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { matchRoutes } from 'react-router-config';
import { Provider } from 'react-redux';
import configureStore from "../client/store";
import 'isomorphic-fetch';

import routes from '../client/routes';
import App from '../client/spa/App';

function renderPage(renderedApp, preloadedState) {
    const appData = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>SPA</title>
    </head>
    <body>
    <div id="app">${renderedApp}</div>
    <script>
        window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
    <script type="text/javascript" src="./public/bundle.js"></script>
    </body>
    </html>`

    return appData;
}

export default function handleRender(req, res) {
    // const css = new Set(); // CSS for all rendered React components
    // const context = { insertCss: (...styles) => styles.forEach(style => css.add(style._getCss())) };
    const context = {};
    const store = configureStore();
    const branch = matchRoutes(routes, req.url);
    const promiseAll = branch.map(({ route, match }) => {
        const { fetchData } = route.component;
        if (!(fetchData instanceof Function)) {
            return Promise.resolve(null);
        }
        return fetchData(store.dispatch, match);
    });
    Promise.all(promiseAll)
        .then(() => {
            const app = (
                <Provider store={store}>
                    <StaticRouter location={req.url} context={context}>
                        <App />
                    </StaticRouter>
                </Provider>
            );
            const renderedApp = renderToString(app);

            if (context.url) {
                return res.redirect(context.url);
            }

            const preloadedState = store.getState();

            return res.send(renderPage(renderedApp, preloadedState));
        });

}