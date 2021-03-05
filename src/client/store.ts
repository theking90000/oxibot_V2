import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducer'

export const history = createBrowserHistory()

history.replace('/loading')

export default function configureStore(preloadedState) {
  const store = createStore(createRootReducer(history),preloadedState,compose(applyMiddleware(
    routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  )

  return store
}