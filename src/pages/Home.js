import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = (props) => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (

        <div>

            <div className='container mx-auto px-3 pb-40'>
                <div className='pt-10 z-20'>
                    <Slider className='cursor-pointer' {...settings}>
                        <div><img className='w-full' src='https://cdn.dsmcdn.com/ty458/campaign/banners/original/609083/e09da1057f_0_new.jpg' alt='banner1' /></div>
                        <div><img className='w-full' src='https://cdn.dsmcdn.com/ty457/pimWidgetApi/webBig_20220620071900_mavi200622weberkek.jpg' alt='banner1' /></div>
                    </Slider>
                </div>
                <div className='flex items-center mt-8 bg-gray-300'>
                    <div className='w-3/4'>
                        <Slider className='cursor-pointer' {...settings}>
                            <div><img className='w-full' src='https://cdn.dsmcdn.com/ty459/pimWidgetApi/webBig_20220622092917_RayBanGunesGozluguKoleksiyonu.jpg' alt='banner1' /></div>
                            <div><img className='w-full' src='https://cdn.dsmcdn.com/ty459/pimWidgetApi/webBig_20220622092917_RayBanGunesGozluguKoleksiyonu.jpg' alt='banner1' /></div>
                        </Slider>
                    </div>
                    <div className='w-1/4 '>
                        <Slider className='cursor-pointer' {...settings}>
                            <div><img className='w-full' src='https://cdn.dsmcdn.com/ty456/pimWidgetApi/mobile_20220621084636_2227241ErkekMobile202205101501.jpg' alt='banner1' /></div>
                            <div><img className='w-full' src='https://cdn.dsmcdn.com/ty456/pimWidgetApi/mobile_20220621084636_2227241ErkekMobile202205101501.jpg' alt='banner1' /></div>
                        </Slider>
                    </div>
                </div>
            </div>


            {/* <div className="bg-gray-900 text-center py-4 lg:px-4">
                <div className="p-2 bg-indigo-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
                    <span className="flex rounded-full bg-indigo-500 uppercase px-2 py-1 text-xs font-bold mr-3">Kullanıcı</span>
                    <span className="font-semibold mr-2 text-left flex-auto">{props.name ? 'Merhaba ' + props.name : 'Giriş yapmadınız.'}</span>
                    <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" /></svg>
                </div>
            </div> */}

        </div>
    )
}

export default Home
