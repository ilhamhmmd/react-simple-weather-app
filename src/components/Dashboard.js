import React, { useState, useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [data, setData] = useState({});
    const [expire, setExpire] = useState('');
    const [lat, setLatitude] = useState('');
    const [long, setLongitude] = useState('');
    const [msg, setMsg] = useState('');
    const [weathers, setWeathers] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        getWeathers();
        refreshToken();
        navigator.geolocation.getCurrentPosition(function (position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        });
    }, [lat, long]);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/");
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setName(decoded.name);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const getWeathers = async () => {
        const response = await axiosJWT.get('http://localhost:5000/weathers', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setWeathers(response.data);
    }

    const deleteWeather = async (id) => {
        await axios.delete(`http://localhost:5000/weather/${id}`);
        getWeathers();
    }

    const weatherCall = async (e) => {
        e.preventDefault()
        const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=hourly,daily&appid=3605da1c5f7af82b2b9c1787a98b6e53`;
        await fetch(url)
            .then(res => res.json())
            .then(result => {
                setData(result);
                console.log(result);
                try {
                    axios.post('http://localhost:5000/weather', {
                        lat: lat,
                        lon: long,
                        timezone: result.timezone
                    });
                    getWeathers();
                } catch (error) {
                    if (error) {
                        setMsg(error.response.data.msg);
                    }
                }
            });
    }

    return (
        <div className="container col-xxl-8 px-4 py-5">
            <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
                <div className="col-10 col-sm-8 col-lg-6">
                    {data.current !== undefined &&
                        <div className="card">
                            <div className="card-body">
                                <div className="temp">
                                    {data.current ? <h1>{data.current.temp.toFixed()}°F</h1> : 'N/A'}
                                </div>
                                <div className="description">
                                    {data.current ? <p>{data.current.weather[0].main + " | " + data.current.weather[0].description}</p> : 'N/A'}
                                </div>
                                <hr />
                                <div className="timezone">
                                    <p>Timezone : {data.timezone ? data.timezone : 'N/A'}</p>
                                </div>
                                <div className="humidity">
                                    <p>Humidity : {data.current ? data.current.humidity + '%' : 'N/A'}</p>
                                </div>
                                <div className="humidity">
                                    <p>Pressure : {data.current ? data.current.pressure : 'N/A'}</p>
                                </div>
                                <div className="wind">
                                    <p>Wind Speed : {data.current ? data.current.wind_speed.toFixed() + ' MPH' : 'N/A'}</p>
                                </div>
                            </div>
                            <p>{msg}</p>
                        </div>
                    }
                </div>
                <div className="col-lg-6">
                    <h1 className="display-5 fw-font-weight-bold lh-1 mb-3">Weather App</h1>
                    <hr />
                    <p className="lead">Halo <strong>{name},</strong> <br />Silahkan cari cuaca berdasarkan lokasimu.</p>
                    <p className='text-danger'>{msg}</p>
                    {data.cod == '400' &&
                        <div className="alert alert-danger">
                            {data.message}
                        </div>
                    }
                    <form onSubmit={weatherCall} >
                        <div className="form-group">
                            <label className="label">Latitude</label>
                            <input type="text" className="form-control" placeholder='Masukkan Latitude'
                                value={lat} onChange={(e) => setLatitude(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label className="label">Longitude</label>
                            <input type="text" className="form-control" placeholder='Masukkan Longitude'
                                value={long} onChange={(e) => setLongitude(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary mt-3">Pencarian</button>
                        </div>
                    </form>
                </div>
            </div>

            <hr />
            <h5>Search History</h5>
            <div className="row">
                <table className="table table-hovered table-responsive">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Lat</th>
                            <th>Lon</th>
                            <th>Timezone</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {weathers.map((weather, index) => (
                            <tr key={weather.id}>
                                <td>{index + 1}</td>
                                <td>{weather.lat}</td>
                                <td>{weather.lon}</td>
                                <td>{weather.timezone}</td>
                                <td>{weather.createdAt}</td>
                                <td>
                                    <button onClick={() => deleteWeather(weather.id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>

    );
}

export default Dashboard;
