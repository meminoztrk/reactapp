import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const usePasswordToggle = () => {
    const [visible,setVisible] = useState(false);
    const Icon = visible ? <button type='button' tabIndex={1} onClick={() => setVisible(false)}><AiFillEyeInvisible className="cursor-pointer w-5 h-5 absolute top-3 transform right-3 text-gray-400 hover:text-orange-600" /></button> :
                           <button type='button' tabIndex={1} onClick={() => setVisible(true)}><AiFillEye className="cursor-pointer w-5 h-5 absolute top-3 transform right-3 text-gray-400 hover:text-orange-600" /></button>;
    const InputType = visible ? "text" : "password";

    return [InputType, Icon];
}

export default usePasswordToggle

