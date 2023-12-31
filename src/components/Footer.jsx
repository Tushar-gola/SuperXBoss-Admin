import React from 'react';
import '../App.css';
import { Outlet } from 'react-router-dom';

export const Footer = React.memo((props) => {
    return (
        <>
            <footer id="footer">
                <p>
                    {props.design}
                    <span>{props.name}</span>
                </p>
            </footer>
            <Outlet />
        </>
    )
});
