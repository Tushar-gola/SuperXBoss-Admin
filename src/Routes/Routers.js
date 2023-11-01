import React from 'react'
import { Route, Routes } from "react-router-dom";
import { SignIn, Users, Categories, WalletOffer, Brands, Shipping, Vechiles, SubCategories, Banner, RolePermission, Coupon, Product, Customer, Dashboard, Faq, Information, Order, Notification } from '../pages';
import { Header, Footer } from '../components';
import { ProtectedRoute, PublicRoute } from '../helpers';
import { Navigate } from 'react-router-dom';
export const Routers = () => {
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
                        <Route path="/categories/sub-categories/:id" element={<SubCategories />} />
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
