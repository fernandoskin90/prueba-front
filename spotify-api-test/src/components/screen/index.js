import React from 'react';

import { Link } from 'react-router-dom';

import './style.scss';

const Wrapper = (props) => {
    const {
        accessToken,
        refreshToken,
        children,
        history
    } = props;

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        history.push('/');
    }


    return (
        <div className="app">
            <div className="header">
                <Link to={`/user/${accessToken}/${refreshToken}`}>User</Link>
                <Link to="/following">Following</Link>
                <a onClick={() => logout()}>Logout</a>
            </div>
            
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default Wrapper;