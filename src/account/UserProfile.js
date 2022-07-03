import { useForm } from 'sunflower-antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  notification,
  Form,
  Spin,
  Input,
  Button
} from 'antd';
import UserPasswordForm from './UserPasswordForm';
import { User } from './../stores/user';
import { useEffect } from 'react';

export const UserProfile = () => {
  const [form] = Form.useForm();
  const user = useSelector(state => state.user.user);

  const dispatch = useDispatch();

  const setProfile = async (name, surname, email, phone) => {
    await fetch(process.env.REACT_APP_API + `/User/${user.id}`, {
      method: 'PATCH',
      headers: {
        'ApiKey': process.env.REACT_APP_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ path: "name", value: name },
      { path: "surname", value: surname },
      { path: "email", value: email },
      { path: "phone", value: phone }])
    }).then(rs => {dispatch(User());openNotificationWithIcon("success")})
      .catch(function (err) {
        console.info(err);
      });
  }

  useEffect(() => {
    form.setFieldsValue({ name: user.name, surname: user.surname, email: user.email, phone: user.phone })
  }, [user,form])

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Bildirim',
      description:
        'Profil başarı ile güncellendi',
    });
  };

  const { formProps, formLoading } = useForm({
    form,
    async submit({ name, surname, email, phone }) {
      console.log('submit');
      await new Promise(r => setTimeout(r, 1000));
      setProfile(name, surname, email, phone)
      return 'ok';
    },
  });



  return (
    <div className='flex lg:flex-row flex-col lg:divide-x'>
      <div className='flex lg:w-1/2 flex-col lg:pr-4'>
        <h1 className='text-orange-500 font-semibold text-[16px]'>Üyelik Bilgilerim</h1>
        <Spin spinning={formLoading}>
          <Form
            {...formProps}
            layout="vertical"
            className="space-y-3 mt-4"
            autoComplete="off"
          >
            <div className='flex space-x-10'>
              <Form.Item
                label="Ad"
                name="name"
                rules={[{ required: true, message: 'Lütfen kategori adı girin!' }]}
              >
                <Input className='2xl:w-[16rem] shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500' />
              </Form.Item>
              <Form.Item
                label="Soyad"
                name="surname"
                rules={[{ required: true, message: 'Lütfen kategori adı girin!' }]}
              >
                <Input className='2xl:w-[16rem] shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500' />
              </Form.Item>

            </div>

            <div className='flex space-x-10'>
              <Form.Item
                label="E-Mail"
                name="email"
                rules={[{ required: true, message: 'Lütfen kategori adı girin!' }]}
              >
                <Input className='2xl:w-[16rem]  shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500' />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Cep Telefonu"
                rules={[
                  {
                    required: true,
                    message: 'Lütfen telefon numarası girin!'
                  },
                  {
                    min: 10,
                    message: 'Bir telefon numarası girin!'
                  },
                  {
                    validator: (_, value) =>
                      value && Number(value)
                        ? Promise.resolve()
                        : Promise.reject(),
                  },
                ]}
              >
                <Input onKeyPress={(e) => (!/[0-9]/.test(e.key)) && e.preventDefault()} className="2xl:w-[16rem] shadow h-11 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-orange-500" />
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

      <div className='flex lg:w-1/2 lg:pl-6 lg:mt-0 mt-8 flex-col'>
        <h1 className='text-orange-500 font-semibold text-[16px]'>Şifre Güncelleme</h1>
        <UserPasswordForm />
      </div>

    </div>
  )
}
