import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillMail } from 'react-icons/ai';
import { BsKeyFill } from 'react-icons/bs';
import usePasswordToggle from './../hooks/usePasswordToggle';
import { useSelector,useDispatch } from 'react-redux';
import { User } from '../stores/user';


const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordInputType, inputIcon] = usePasswordToggle();
    const dispatch = useDispatch();

    let navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://localhost:7168/api/User/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        });
        const content = await response.json();
        dispatch(User());
        navigate("/");

    }


    return (
        <div>

            <div className="w-full max-w-sm mx-auto my-20">
                <div className='space-y-2 py-5'>
                    <h1 className='text-2xl font-semibold text-center'>Merhaba,</h1>
                    <p className='text-center'>Siteye giriş yap ve alışverişin keyfini çıkar!</p>
                </div>

                <form onSubmit={submit} className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4 text-sm">
                    <div className="mb-2 relative">
                        <AiFillMail className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        <input className="shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required onChange={e => setEmail(e.target.value)} type="email" placeholder='E-posta adresiniz...' tabIndex="0" />
                    </div>
                    <div className="mb-4 relative">
                        <BsKeyFill className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        {inputIcon}
                        <input className="shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" required onChange={e => setPassword(e.target.value)} type={passwordInputType} placeholder='Şifreniz...' maxLength="16" tabIndex="0" />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" tabIndex="0">
                            Giriş yap
                        </button>
                        <a className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-600" href="# ">
                            Şifremi unuttum
                        </a>
                    </div>
                    <hr className='my-5'></hr>
                    <button className="  text-orange-500 w-full font-bold py-2 px-4 rounded border border-orange-500 hover:border-orange-300" type="button">
                        Ücretsiz üye ol
                    </button>
                    <div className='w-full h-4 border-b text-center mb-6 mt-3'>
                        <span className='bg-white top-1 px-2 relative text-xs'>Üye olmayan kullanıcılar için</span>
                    </div>
                    <button className="  text-orange-500 w-full font-bold py-2 px-4 rounded border border-orange-500 hover:border-orange-300" type="button">
                        Sipariş takibi yap
                    </button>
                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2020 Meminoztrk
                </p>
            </div>
        </div>
    )
}

export default Login
