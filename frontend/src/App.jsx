import { Provider } from 'react-redux'
import store from './store/store'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Body from './components/body'
import Login from './components/login'

const App = () => {

  return (
    <Provider store={store}>
      <BrowserRouter basename='/'>
      <Routes>
          <Route path="/" element={<Body />}/>
          <Route path="/login" element={<Login />}/>
      </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
