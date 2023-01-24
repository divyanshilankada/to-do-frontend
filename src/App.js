import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import ToDoPage from './components/toDoPage';
import './styles/App.css'

function App() {
  return (
    <div className="App">
         <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage />}></Route>
                <Route path='/register' element={<RegisterPage />}></Route>
                <Route path='/invoice' element={<ToDoPage />}></Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
