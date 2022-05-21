import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { setNavigation } from '../stores/admin/navigation';

const Orders = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setNavigation("Siparişler"))
    }, [dispatch]);

    return (
        <div>Orders</div>
    )
}

export default Orders;
