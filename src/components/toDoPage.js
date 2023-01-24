import { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import '../styles/toDoPage.css';


function ToDoPage () {

    const navigate = useNavigate();
    const name = localStorage.getItem('name');
    var header = {token: localStorage.getItem('token')};

    const [activity, setActivity] = useState("");
    const [userActivities, setUserActivities] = useState([]);
    const [flag, setFlag] = useState([true]);
    const [time, setTime] = useState(0);
    const [timer,setTimer] = useState(false);
    const [displayTime, setDisplayTime] = useState([]);
    const [history, setHistory] = useState([]);


    useEffect(() => {

         axios.get('https://to-do-backend-app.onrender.com/activity', {headers:header})
                       // .then(response => response.json())
                        .then (data => {data.data.message === null ? console.log("no activities") : setUserActivities([...data.data.message]); let arr = new Array(data.data.message.length).fill(false); console.log(arr); setDisplayTime([...arr]) })
                        .catch(error => {console.log(error);});
    },[]);

    useEffect(() => {

        axios.get('https://to-do-backend-app.onrender.com/activity', {headers:header})
                      // .then(response => response.json())
                      //.then(data => console.log(data))
                      .then (data => {data.data.message === null ? console.log(data.data.message) : setUserActivities([]); console.log(userActivities,"kkkk"); let dataArr = data.data.message; dataArr.sort((a,b) => {
                            let statusA = a.status.toLowerCase();                            
                            let statusB = b.status.toLowerCase();

                            if(statusA < statusB)
                            {
                                return 1;
                            }
                            else
                            {
                                return -1;
                            }

                      }) ;console.log(dataArr);setUserActivities([...dataArr]);

                      let hisArr = data.data.message; hisArr.sort((a,b) => {
                        let statusA = a.activity.toLowerCase();                            
                        let statusB = b.activity.toLowerCase();

                        if(statusA > statusB)
                        {
                            return 1;
                        }
                        else
                        {
                            return -1;
                        }

                  }) ; setHistory([...hisArr]);
                      
                      
                      
                      
                       let arr = new Array(data.data.message.length).fill(false); setDisplayTime([...arr]); })
                       .catch(error =>{error.response === undefined ? console.log(error, "kkk") : error.response.data.message ==="jwt expired" ? handleLogout() : console.log(error.response.data)});
   },[flag]);

   useEffect(() => {
    let interval = null;
    
    if(timer)
    {
        interval = setInterval(() => {

            setTime(time=> time+10);  
    
        },10)
    }
    else
    {
        clearInterval(interval);
    }

        return () => clearInterval();
   },[timer]);

    //console.log(displayTime.length);

    function handleLogout()
    {
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate("/");
    }

    function handleActivityChange(e)
    {
        setActivity(e.target.value);
    }

    function handleAddActivity()
    {
        const func = async () => {

            let activityObj = {"activity" : activity, "status" : "Pending", "time":0};
            console.log(activityObj);          

             await axios.post('https://to-do-backend-app.onrender.com/activity',activityObj, {
                            headers:header
                        })
                        .then(response => console.log(response))
                        .catch(error => {
                            console.log(error);
                        });
            let arr = [true]
            setFlag([...arr]);
            setActivity("");
        }
        
        func();
    }

    function handleStart(e)
    {
        if(timer===false)
        {
            let i = e.target.id;
            let arr = displayTime;
            arr[i] = true;
            setTime(userActivities[i].time);
            setDisplayTime([...arr]);
            setTimer(true);
        }
    
    }

    function handlePause(e)
    {
        
        //setTime(userActivities[i].time);
        console.log("pause",userActivities[e.target.id]);

        const func = async () => {

            let activityObj = {"time":time, "id":userActivities[e.target.id]._id};
            console.log(activityObj);          

            await axios.put('https://to-do-backend-app.onrender.com/activity',activityObj, {
                            headers:header
                        })
                        .then(response => console.log(response))
                        .catch(error => {
                            console.log(error);
                        });
            
            let arr = [true]
            setFlag([...arr]);
            
            let i = e.target.id;
            let arr2 = displayTime;
            arr2[i] = false;
            setDisplayTime([...arr2]);
            setTimer(false);
        }
        
        func();

    }

    function handleStop(e)
    {
        
        //setTime(userActivities[i].time);
        console.log("pause",userActivities[e.target.id]);

        const func = async () => {

            let activityObj = {"status":"Completed", "id":userActivities[e.target.id]._id,"time":time};
            console.log(activityObj);          

            await axios.put('https://to-do-backend-app.onrender.com/activity',activityObj, {
                            headers:header
                        })
                        .then(response => console.log(response))
                        .catch(error => {
                            console.log(error);
                        });
            
                        let arr = [true]
                        setFlag([...arr]);
            
            let i = e.target.id;
            let arr2 = displayTime;
            arr2[i] = false;
            setDisplayTime([...arr2]);
            setTimer(false);
        }
        
        func();

    }

    //console.log(userActivities)

    return (
        <>
            {name === null ? <Link className='login_h1_todo' to='/login'>Login</Link> : 
            
            <div className='to-do-container'>
                <header className='name_box'>
                    <h1>To-Do</h1>
                    <h4 className='name_h4'>{name}</h4>                   
                </header>

                <div className='main_box'>
                    <aside className='sidebar_box'>
                        <h3>To-Do List</h3>
                        <p>History</p>
                        <div className='activity_history_box'>
                            { history.map((user,i) => 
                            
                                user.status === "Completed" ? <p key={i}>{i+1}. {user.activity}</p> : null
                            )}
                        </div>
                
                        <h3 className='logout_button' onClick={handleLogout}>Logout</h3>
                    </aside>

                    <div className='to_main_container'>
                        <main className='todo_main_box'>
                            <input type="text" id="ftodo" value={activity} placeholder="Enter you activity here" onChange={handleActivityChange}></input>
                            <button className='add_button' onClick={handleAddActivity}>Add New Activity</button>
                        </main>

                        {userActivities.length === 0 ? <></> : 

                            <div className='activity_main_box' >
                                <div className='activity_header_box'>
                                    <div className='activity_header'>Activity</div>
                                    <div className='activity_header'>Status</div>
                                    <div className='activity_header'>Time Taken (Hrs:Mins:Secs)</div>
                                    <div className='activity_header'>Action</div>
                                </div>

                                {userActivities.map((user, i) => 
                                    <div className='activity_list_box' key={i}>
                                        <div className='activity'>{user.activity}</div>
                                        <div className='activity'>{user.status}</div>
                                        {displayTime.length === 0 ? <></> :  displayTime[i] ?

                                            <div className='activity'>
                                                <span>{Math.floor((time/60000)%60)}</span>
                                                <span> : </span>
                                                <span>{Math.floor((time/1000)%60)}</span>
                                            </div>
                                        
                                        : 
                                        
                                            <div className='activity'>
                                                <span>{Math.floor((user.time/60000)%60)}</span>
                                                <span> : </span>
                                                <span>{Math.floor((user.time/1000)%60)}</span>
                                            </div>
                                        
                                        }
                                        
                                        {displayTime.length === 0 ? <></> :  displayTime[i] ? 
                                        
                                            <div className='activity'>
                                                <span id={i} className='hover' onClick={handleStop}>Stop</span>
                                                <span id={i} className='hover' onClick={handlePause}>Pause</span>
                                            </div>
                                        
                                        : 
                                            
                                            <div className='activity hover' id={i} onClick={handleStart}>{user.status === "Pending" ? "Start" : ""}</div>
                                        
                                        }
                                    </div>
                                )}
                            </div>
                        
                        }
                    </div>   
                </div>
            </div>
            
            }
        </>
        
    );
};

export default ToDoPage;

