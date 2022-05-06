import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineUser, AiOutlineKey, AiOutlineMail, AiOutlinePhone, AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai';
import usePasswordToggle from './../hooks/usePasswordToggle';
import InputMask from 'react-input-mask';
import Checkbox from '@mui/material/Checkbox';
import { orange } from '@mui/material/colors';

function Register() {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [nameval, setNameval] = useState({ validation: "", border: "" });
    const [surnameval, setSurnameval] = useState({ validation: "", border: "" });
    const [emailval, setEmailval] = useState("");
    const [pwval, setPwval] = useState({ firsticon: "", secondicon: "", visible: "hidden" });
    const [phoneval, setPhoneval] = useState("");

    const [passwordInputType, inputIcon] = usePasswordToggle();

    const [validation, setValidation] = useState({ fields: {} })
    const [formValid, setFormValid] = useState(false);
    const [validMessage, setValidMessage] = useState("");

    const [loading, setLoading] = useState(false);

    var mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var pwformat = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

    const handleValidation = (field) => {
        let fields = validation.fields;

        if (fields["name"] && field === "name") {
            if (fields["name"].length < 3) {
                setNameval({ validation: "Adınız en az 3 karakterden oluşmalı.", border: "border-rose-500" })
            }
            else {
                setNameval({ validation: "", border: "" })
            }
        }

        if (fields["surname"] && field === "surname") {
            if (fields["surname"].length < 2) {
                setSurnameval({ validation: "Soyadınız en az 2 karakterden oluşmalı.", border: "border-rose-500" })
            }
            else {
                setSurnameval({ validation: "", border: "" })
            }
        }

        if (fields["email"] && field === "email") {
            if (!fields["email"].toLowerCase().match(mailformat)) {
                setEmailval({ validation: "Geçerli bir e-posta adresi yazmalısınız.", border: "border-rose-500" })
            }
            else {
                setEmailval({ validation: "", border: "" })
            }
        }

        if (fields["phone"] && field === "phone") {
            if (fields["phone"].length < 10) {
                setPhoneval({ validation: "Cep telefonunuzu eksik yazdınız.", border: "border-rose-500" })
            }
            else {
                setPhoneval({ validation: "", border: "" })
            }
        }
        checkValidation()
        setValidation({ fields })
        console.log(validation)
    }

    const checkValidation = () => {
        let fields = validation.fields;
        setFormValid(true);

        if (!fields["name"]) {
            setFormValid(false);
        }
        if (fields["name"]) {
            if (fields["name"].length < 3) {
                setFormValid(false);
            }
        }

        if (!fields["surname"]) {
            setFormValid(false);
        }
        if (fields["surname"]) {
            if (fields["surname"].length < 2) {
                setFormValid(false);
            }
        }
        if (!fields["email"]) {
            setFormValid(false);
        }
        if (fields["email"]) {
            if (!fields["email"].toLowerCase().match(mailformat)) {
                setFormValid(false);
            }
        }
        if (!fields["password"]) {
            setFormValid(false);
        }
        if (fields["password"]) {
            if (fields["password"].length < 6 && fields["password"].toLowerCase().match(pwformat)) {
                setFormValid(false);
            }
        }
        if (!fields["phone"]) {
            setFormValid(false);
        }
        if (fields["phone"]) {
            if (fields["phone"].length < 10) {
                setFormValid(false);
            }
        }
        console.log(fields["phone"])
    }

    const handleBlur = (field, value) => {
        let fields = validation.fields;
        fields[field] = value;
        setValidation({ fields });
        handleValidation(field);
    }

    const PasswordValidation = (value) => {
        pwval.visible = "block";
        if (value.length >= 6 && value.toLowerCase().match(pwformat) != null) {
            setPwval({
                firsticon: <AiFillCheckCircle className="pointer-events-none w-5 h-5 transform left-3 text-green-500" />,
                secondicon: <AiFillCheckCircle className="pointer-events-none w-5 h-5 transform left-3 text-green-500" />,
            })
        }
        else if (value.length >= 6 && value.toLowerCase().match(pwformat) == null) {
            setPwval({
                firsticon: <AiFillCheckCircle className="pointer-events-none w-5 h-5 transform left-3 text-green-500" />,
                secondicon: <AiFillCloseCircle className="pointer-events-none w-5 h-5 transform left-3 text-red-500" />,
            })
        }
        else if (value.length < 6 && value.toLowerCase().match(pwformat) != null) {
            setPwval({
                firsticon: <AiFillCloseCircle className="pointer-events-none w-5 h-5 transform left-3 text-red-500" />,
                secondicon: <AiFillCheckCircle className="pointer-events-none w-5 h-5 transform left-3 text-green-500" />,
            })
        }
        else if (value.length < 6 && value.toLowerCase().match(pwformat) == null) {
            setPwval({
                firsticon: <AiFillCloseCircle className="pointer-events-none w-5 h-5 transform left-3 text-red-500" />,
                secondicon: <AiFillCloseCircle className="pointer-events-none w-5 h-5 transform left-3 text-red-500" />,
            })
        }
    }

    let navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (formValid === true) {
            setLoading(true)
            await fetch('https://localhost:8000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    email: email,
                    password: password,
                    phone: phone
                })
            }).then(response => {
                if (response.ok) {
                    navigate("/login");
                }
            })
                .catch(function (err) {
                    console.info(err);
                    setValidMessage("Bir hata oluştu!")
                });
                setLoading(false)
        }
        else {
            setValidMessage("Eksik veya hatalı bilgi girdiniz!")
        }


    }

    return (
        <div>
            <div className="w-full max-w-sm mx-auto my-20">
                <div className='space-y-2 py-5'>
                    <p className='text-2xl font-semibold text-center'>Merhaba,</p>
                    <p className='text-center'>Siteye üye ol ve indirimleri kaçırma!</p>
                </div>
                <form onSubmit={submit} id="signform" className="bg-white shadow-xl rounded px-8 pt-2 pb-8 mb-4 text-sm" noValidate>
                    <span className='text-xs text-red-500 text-center block py-3'>{validMessage}</span>
                    <div className="mb-4 relative">
                        <AiOutlineUser className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        <input className={(nameval.border) + " shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500"} required onChange={e => setName(e.target.value)} onBlur={(e) => handleBlur("name", e.target.value)} type="text" placeholder='Adınız...*' tabIndex="0" minLength={3} />
                        <span className='text-xs text-red-500 ml-1'>{nameval.validation}</span>
                    </div>
                    <div className="mb-4 relative">
                        <AiOutlineUser className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        <input className={(surnameval.border) + " shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500"} required onChange={e => setSurname(e.target.value)} onBlur={(e) => handleBlur("surname", e.target.value)} type="text" placeholder='Soyadınız...*' tabIndex="0" minLength={3} />
                        <span className='text-xs text-red-500 ml-1'>{surnameval.validation}</span>
                    </div>
                    <div className="mb-4 relative">
                        <AiOutlineMail className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        <input className={(emailval.border) + " shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500"} required onChange={e => setEmail(e.target.value)} onBlur={(e) => handleBlur("email", e.target.value)} type="email" placeholder='E-posta adresiniz...*' tabIndex="0" />
                        <span className='text-xs text-red-500 ml-1'>{emailval.validation}</span>
                    </div>
                    <div className="mb-4 relative">
                        <AiOutlineKey className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        {inputIcon}
                        <input className="shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500" required onChange={(e) => { setPassword(e.target.value); PasswordValidation(e.target.value) }} onBlur={(e) => handleBlur("password", e.target.value)} type={passwordInputType} placeholder='Şifreniz...*' maxLength="16" tabIndex="0" pattern='(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,50})$' />
                        <div className={"text-xs " + pwval.visible}>
                            <span className='pt-2 pl-1 flex items-center gap-x-2'>{pwval.firsticon} En az 6 karakterden oluşmalıdır.</span>
                            <span className='py-2 pl-1 flex items-center gap-x-2'>{pwval.secondicon} En az 1 rakam ve 1 harf içermelidir.</span>
                        </div>
                    </div>
                    <div className="mb-6 relative">
                        <AiOutlinePhone className="pointer-events-none w-5 h-5 absolute top-3 transform left-3 text-gray-400" />
                        <InputMask mask="(599) 999 99 99" className="shadow pl-10 h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500" required onChange={e => setPhone(e.target.value.replace(/[#_ ()]/g, ''))} onBlur={(e) => handleBlur("phone", e.target.value.replace(/[#_ ()]/g, ''))} type="tel" placeholder='Telefon numaranız...*' tabIndex="0" pattern="(\D*\d){2,}" />
                        <span className='text-xs text-red-500 ml-1'>{phoneval.validation}</span>
                    </div>
                    <div className='flex text-xs items-start' style={{ fontSize: 10.5 }}>
                        <Checkbox sx={{
                            padding: 0,
                            color: orange[500],
                            '&.Mui-checked': {
                                color: orange[600],
                            },
                        }} /><span className='px-2 leading-3 mt-1'>Bu şirket tarafından bana ticari elektronik ileti gönderilmesine, kişisel verilemi pazarlama faaliyetleri için işlemesine izin veriyorum.</span>
                    </div>

                    <div style={{ fontSize: 10.5 }}>

                        <span className='block py-3 pl-1 leading-3'>
                            Kayıt olarak <span className='text-orange-500 font-semibold'>Kullanıcı Sözleşmesini </span>
                            okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz. Kişisel verilerinizin işlenmesine ilişkin olarak lütfen
                            <span className='text-orange-500 font-semibold'> Gizlilik ve Çerez</span> Politikasını inceleyiniz.
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white w-full font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" tabIndex="0">
                            {loading ? (<svg role="status" className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-500 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>) : "Üye ol"}
                        </button>
                    </div>

                </form>
                <p className="text-center text-gray-500 text-xs">
                    &copy;2020 Meminoztrk
                </p>
            </div>
        </div>
    )
}

export default Register
