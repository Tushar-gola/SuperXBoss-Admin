import React from 'react'
import SignIn from '../pages/SignIn';
import Dashboard from '../pages/Dashboard';
import {
    Route, Routes
} from "react-router-dom";
import Categories from '../pages/Categories';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SubCatagries from '../pages/SubCatagries';
import Brands from '../pages/Brands';
import Users from '../pages/Users';
import ProtectedRoute from '../helpers/ProtectedRoute';
import PublicRoute from '../helpers/PublicRoute';
import { Navigate } from 'react-router-dom';
import Vechiles from '../pages/Vechiles';
import Product from '../pages/Product';
import RolePermission from '../pages/RolePermission';
import Customer from '../pages/Customer';
import Order from '../pages/Order';
import Shipping from '../pages/Shipping';
import Notification from '../pages/Notification';
import Coupon from '../pages/Coupon';
import WalletOffer from '../pages/WalletOffer';
import Information from '../pages/Information';
import Banner from '../pages/Banner';
import Faq from '../pages/Faq';

export default function Routers() {
    return (
        <>
            <Routes>
                <Route path="/" element={<PublicRoute />}>
                    <Route path='/' element={<Navigate replace to="/signIn" />} />
                    <Route path='/signIn' element={<SignIn />} />
                </Route>
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/" element={<Header />} >
                        <Route path='/' element={<Navigate replace to="/dashboard" />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/categories' element={<Categories />} />
                        <Route path="/categories/sub-categories/:id" element={<SubCatagries />} />
                        <Route path="/brands" element={<Brands />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/vehicle" element={<Vechiles />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/role-permissions" element={<RolePermission />} />
                        <Route path="/shipping" element={<Shipping />} />
                        <Route path="/customers" element={<Customer />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/coupon" element={<Coupon />} />
                        <Route path="/notification" element={<Notification />} />
                        <Route path="/wallet-offer" element={<WalletOffer />} />
                        <Route path="/information" element={<Information />} />
                        <Route path="/banner" element={<Banner />} />
                        <Route path="/faq" element={<Faq />} />

                    </Route>
                </Route>
            </Routes>
            <Footer design="Design & Developed By" name=" Technosters Technologies Pvt. Ltd." />
        </>
    )
}
