import './LandingPage.css';
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="mt-5">
            <div className="p-5">
                <h1 className="display-4">Welcome to CollabTool</h1>
                <p className="lead">
                    CollabTool is your go-to platform for seamless real-time collaboration. 
                    Work together on documents, share ideas, and communicate effortlessly with your team.
                </p>
                <hr className="my-4" />
                <p className='p-6'>
                    Whether you're working on a team project or just need to organize your thoughts, 
                    CollabTool offers all the features you need to stay productive.
                </p>
                <div className="mt-4">
                    <Link to="/register" className="btn btn-primary btn-lg me-3">Register</Link>
                    <Link to="/login" className="btn btn-danger btn-lg me-4">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;