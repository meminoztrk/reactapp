import React, { useState } from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = (props) => {
    const [actState, setActState] = useState({
        activeObject: null,
        object: [{ id: 1, text: 'Elektronik' },
        { id: 2, text: 'Moda' },
        { id: 3, text: 'Ev, Yaşam, Kırtasiye, Ofis' },
        { id: 4, text: 'Oto, Bahçe, Yapı Market' },
        { id: 5, text: 'Anne, Bebek, Oyuncak' },
        { id: 6, text: 'Kozmetik, Kişisel Bakım' },
        { id: 7, text: 'Kitap, Müzik, Film, Hobi' }]
    })
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const toggleActive = (index) => {
        setActState({...actState, activeObject:actState.object[index]})
    }

    const toggleActiveStyles = (index) => {
        if(actState.object[index] === actState.activeObject){ console.log("active",index);return "active "}else{return ""}
        
    }


    return (

        <div>
            <div lang='tr' className='px-2 py-2 md:text-sm text-2xl text-center items-center font-semibold divide-gray-400 uppercase bg-gray-100 border-b-2 border-gray-100 shadow'>
                <div className='container mx-auto flex justify-between px-2 text-gray-700'>
                    {actState.object.map((object, index) => (
                        <React.Fragment key={index}>
                            <div className={(toggleActiveStyles(index)) + "px-2 py-2 group relative cursor-pointer cross"} onClick={() => toggleActive(index)}>
                                {object.text}
                            </div>
                            {actState.object.length - 1 !== index ? <span className='block h-8 border-l border-gray-300'></span> : '' }            
                        </React.Fragment>
                    ))}
                </div>
                <div className='container hidden absolute mt-3 rounded-b-xl mx-auto w-screen h-40 z-30 left-0 right-0 group-hover:block bg-gray-100 shadow-2xl'>
                    test
                </div>
            </div>
            <div className='container mx-auto px-3 pb-40'>
                <div className='cursor-pointer pt-10'>
                    <Slider {...settings}>
                        <div><img className='w-full' src='https://cdns.gamermarkt.com/files/images/index/epic_games_banner_tr.png' alt='banner1' /></div>
                        <div><img className='w-full' src='https://cdns.gamermarkt.com/files/images/index/epic_games_banner_tr.png' alt='banner1' /></div>
                    </Slider>
                </div>
            </div>


            {/* <div className="bg-indigo-400 text-center py-4 lg:px-4">
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
