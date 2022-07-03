import React from 'react'
import { useForm } from 'sunflower-antd';
import { useSelector } from 'react-redux';
import {
    notification,
    Form,
    Spin,
    Input,
    Button
} from 'antd';

const UserPasswordForm = () => {
    const [form] = Form.useForm();
    const user = useSelector(state => state.user.user);

    const setPassword = async (password, newpassword) => {
        await fetch(process.env.REACT_APP_API + `/User/UpdatePasswordPatch/?email=${user.email}&password=${password}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': process.env.REACT_APP_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([{ path: "password", value: newpassword }])
        }).then(rp => rp.status === 400 ? openNotificationWithIcon("error", "Şifrenizi yanlış girdiniz.")
            : openNotificationWithIcon("success", "Şifre başarı ile güncellendi"))
            .catch(function (err) {
                console.info(err);
            });
    }

    const openNotificationWithIcon = (type,text) => {
        notification[type]({
            message: 'Bildirim',
            description: text,
        });
    };

    const { formProps, formLoading } = useForm({
        form,
        async submit({ password, newpassword }) {
            console.log('submit');
            await new Promise(r => setTimeout(r, 1000));
            setPassword(password, newpassword)
            form.resetFields();
            return 'ok';
        },
    });
    return (
        <div>
            <Spin spinning={formLoading}>
                <Form
                    {...formProps}
                    layout="vertical"
                    className="space-y-3 mt-4"
                    autoComplete="off"
                >
                    <div className='flex space-x-10'>
                        <Form.Item
                            label="Şu Anki Şifre"
                            name="password"
                            rules={[{ required: true, message: 'Lütfen şu anki şifrenizi girin!' }]}
                        >
                            <Input.Password placeholder="Şifreniz" className='2xl:w-[16rem] shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500' />
                        </Form.Item>
                    </div>

                    <div className='flex space-x-10'>
                        <Form.Item
                            name="newpassword"
                            label="Yeni Şifre"
                            rules={[{ required: true, message: 'Lütfen yeni şifrenizi girin!' }]}
                        >
                            <Input.Password placeholder='Yeni şifre' className="2xl:w-[16rem] shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Yeni Şifre (Tekrar)"
                            rules={[
                                {
                                    required: true, message: 'Lütfen yeni şifrenizi tekrar girin!'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newpassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            "Şifre uyuşmuyor"
                                        );
                                    },
                                }),
                            ]}
                            hasFeedback
                        >

                            <Input.Password placeholder="Şifreyi doğrula" className='2xl:w-[16rem] shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500' />
                        </Form.Item>

                    </div>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className='w-full bg-orange-500 border-none h-10 rounded mt-4 hover:bg-orange-600'>
                            Kaydet
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    )
}

export default UserPasswordForm;
