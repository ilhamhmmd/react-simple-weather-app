import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout');
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand font-weght-bold" href="dashboard">Simple Weather</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    </ul>
                    <form className="d-flex">
                        <button className="btn btn-outline-success" onClick={Logout}>Log Out</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar