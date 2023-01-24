import { useState, useEffect } from 'react';
import '../styles/register.css';
import { useNavigate,Link } from "react-router-dom";
import axios from 'axios'



function RegisterPage () {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userExists, setUserExists] = useState("");
    const [error, setError] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://to-do-backend-app.onrender.com/register')
            .then(response => response.json())
            .then(data => setUserExists(data.message))          
    },[]);


    function handleUsername(e)
    {
        let name = e.target.value;
        setUsername(name);
    }

    function handlePassword(e)
    {
        let pw = e.target.value;
        setPassword(pw);
    }

    function handleConfirmPassword(e)
    {
        let cpw = e.target.value;
        setConfirmPassword(cpw);
    }

    async function handleSubmit()
    {
        console.log(username, password, confirmPassword);

        if(username !== "" || password!== "" || confirmPassword!=="")
        {
            setError(true);

            let exists = true;

            for(let i=0; i<userExists.length; i++)
            {
                if(userExists[i].user_name === username)
                {
                    exists = false;
                }
            }

            console.log(exists);
            if(exists === true)
            {
                setError(true);

                if(password === confirmPassword)
                {
                    setError(true);
                    let userObj = {"user_name" : username, "password" : password};
    
                    axios.post('https://to-do-backend-app.onrender.com/register',userObj)
                        .then(response => {
                            console.log(response);
                        })
                        .catch(error => {
                            console.log(error);
                        });
    
                    navigate("/");
                }
                else
                {
                    setError(false);
                }

            }
            else
            {
                setError(false);
            }
            
        }
        else
        {
            setError(false)
        }
    }

    return (
        <div className='register-container'>
            <div className='register-box'>
                <h1 className='register_h1'>Register</h1>
                <input type="text" className='input_box' placeholder='Username' value={username} onChange={handleUsername}></input>
                <input type="password" className='input_box' placeholder='Password' value={password} onChange={handlePassword}></input>
                <input type="password" className='input_box' placeholder='Confirm password' value={confirmPassword} onChange={handleConfirmPassword}></input>
                <button className='register_button' onClick={handleSubmit}>REGISTER</button>
                {error === false ? <p className='incorrect'>*Incorrect details or user name already exists</p> : <></>}
                <Link className='register_p' to="/">Login</Link>
            </div>
        </div>
    );
};

export default RegisterPage;

