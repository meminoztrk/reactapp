import React,{useEffect} from 'react'
import AccountNav from './AccountNav';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppAccount = () => {
    let navigate = useNavigate();
    const user = useSelector(state => state.user.user);
    useEffect(() => {
        async function fetchData(){
            await axios.get(process.env.REACT_APP_API + "/User/user", {
              headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
              },
              withCredentials: true,
            }).catch((err) => {
                navigate('/giris')
              });
          }
          fetchData();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    
    return (
        <div className='container mx-auto py-10'>
            {user.id && <AccountNav />}
        </div>
    )
}

export default AppAccount;