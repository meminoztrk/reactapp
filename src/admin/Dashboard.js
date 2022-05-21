import React, { useEffect } from 'react'
import { setNavigation } from '../stores/admin/navigation'
import { useDispatch } from 'react-redux';

const Dashboard = () => {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setNavigation("Gösterge Paneli"))
  }, [dispatch]);


  return (
    <div>Dashboard</div>
  )
}

export default Dashboard;


