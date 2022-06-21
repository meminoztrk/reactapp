import React,{useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { setNavigation } from '../stores/admin/navigation';

const OrdersCompleted = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setNavigation("Tamamlanan Siparişler"))
    }, [dispatch]);

    return (
        <div>TAMAMLANAN</div>
    )
}

export default OrdersCompleted;
