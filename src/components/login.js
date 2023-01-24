import { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import '../styles/login.css'
import axios from 'axios'


function LoginPage () {

    const [userDetails, setUserDetails] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
 
    const navigate = useNavigate();


    useEffect(() => {
        fetch('https://to-do-backend-app.onrender.com/register')
            .then(response => response.json())
            .then(data => setUserDetails(data.message));
            
       // window.location.reload(false);
    });

    function handleSubmit()
    {
        let exists = true;
        console.log(userDetails);

            for(let i=0; i<userDetails.length; i++)
            {
                console.log(userDetails[i].user_name)
                if(userDetails[i].user_name === username)
                {
                    exists = false;
                }
            }
           // console.log(userDetails);
            console.log(exists);
        if(exists === false)
        {
            setError("");
            const func = async () => {

                let userObj = {"user_name" : username, "password" : password};
                console.log(userObj);
                const res = await axios.post('https://to-do-backend-app.onrender.com/login',userObj)
                            .then(response => {
                                setError(response);

                                localStorage.setItem("token", response.data.token);
                                localStorage.setItem("name", username);
                                localStorage.setItem("userId",response.data._id)
                                navigate("/invoice");
                                
                            })
                            .catch(error => {
                                console.log("error");
                                console.log(error);
                                setError("*Incorrect entries");

                            });


            }
            
            func();
        }
        else
        {
            setError("*Incorrect entries");
        }
    }

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

    return (
        <div className='login-container'>
            <div className='login-box'>
                <h1 className='login_h1'>Login</h1>
                <input type="text" className='input_box' placeholder='Username' value={username} onChange={handleUsername}></input>
                <input type="password" className='input_box' placeholder='Password' value={password} onChange={handlePassword}></input>
                <button className='login_button' onClick={handleSubmit}>LOGIN</button>
                {error !== "" ? <p>{error}</p> : <></>}
                <Link className='login_p' to='/register'>Register</Link>
            </div>
        </div>
    );
};

export default LoginPage;

