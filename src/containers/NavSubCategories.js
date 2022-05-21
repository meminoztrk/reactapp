import React, { useEffect } from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import UseSeoHelper from './../hooks/useSeoHelper';
import { setMenuVisibility } from '../stores/category';
import { useDispatch } from 'react-redux';


const NavSubCategories = (props) => {
  const categories = useSelector(state => state.category.mainCategories);
  const dispatch = useDispatch();

  function setBlock() {
    dispatch(setMenuVisibility({display:"hidden",actState:-1}))
  }

  useEffect(() => {
  }, [categories]);

  let selectedCategories = "";
  if (props.categoryId < 0) {
    selectedCategories = (
      <h1>Loading...</h1>
    )
  }
  else {
    const select = categories.find(x => x.id === props.categoryId)
    selectedCategories = (
      <div className="py-10 px-5">

        <span className="text-left pl-10 block font-normal text-lg normal-case text-orange-500">
          <Link key={select.id} to={`/kategori/${UseSeoHelper(select.name)}`} className="hover:text-orange-500 hover:underline" onClick={() => setBlock()}>{select.name} Kategorisi</Link>
          <i className="fa-solid fa-arrow-right pl-1"></i>
        </span>

        <div className="flex">

          <div className="flex flex-wrap w-3/4">
            {select.subCategories.map((category, index) =>
              <div className="pl-10 pr-1 py-5 text-left w-1/3" key={index}>
                <Link to={`/kategori/${UseSeoHelper(select.name)}/${UseSeoHelper(category.name)}`} className="hover:text-orange-500 hover:underline block" onClick={() => setBlock()}>{category.name} </Link>

                {category.subCategories.map((sub, index) =>
                  <Link to={`/kategori/${UseSeoHelper(select.name)}/${UseSeoHelper(category.name)}/${UseSeoHelper(sub.name)}`} className="pr-4 text-xs font-medium hover:underline" key={index} onClick={() => setBlock()}>{sub.name}</Link>
                )}
                <Link to={`/kategori/${UseSeoHelper(select.name)}/${UseSeoHelper(category.name)}`}className="block text-orange-500 hover:underline normal-case font-normal pt-1 text-xs" onClick={() => setBlock()}>Tümünü gör</Link>

              </div>

            )}
          </div>

          <div className="flex justify-center p-5 pl-10">
            <img src="https://mcdn01.gittigidiyor.net/cdimg/anasayfa/nucleus/electronic-2x.jpg" className="w-60 pb-2" alt="mylogo" />
          </div>

        </div>
                  
      </div>
    )


  };
  return (
    <>
      {selectedCategories}
    </>
  );
};

export default NavSubCategories;
