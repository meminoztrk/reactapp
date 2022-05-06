import React from 'react'
import { Outlet } from 'react-router-dom'
// import { Route, Routes } from 'react-router-dom'
// import { NotFound } from './NotFound';

export default function AppAdmin() {
    return (
        <div>AppAdmin
            <Outlet/>
        </div>
    )
}
