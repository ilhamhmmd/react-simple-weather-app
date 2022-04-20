import { useState, useEffect } from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
 
const SearchList = () => {
    const [weathers, setWeather] = useState([]);
 
    useEffect(() => {
        getWeathers();
    }, []);
 
    const getWeathers = async () => {
        const response = await axios.get('http://localhost:5000/weathers');
        setWeather(response.data);
    }
 
    const deleteWeather = async (id) => {
        await axios.delete(`http://localhost:5000/weather/${id}`);
        getWeathers();
    }
 
    return (
        <div>
            <table className="table table-hovered table-responsive">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Lat</th>
                        <th>Lon</th>
                        <th>Timezone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { weathers.map((weather, index) => (
                        <tr key={ weather.id }>
                            <td>{ index + 1 }</td>
                            <td>{ weather.lat }</td>
                            <td>{ weather.lon }</td>
                            <td>{ weather.timezone }</td>
                            <td>
                                <button onClick={ () => deleteWeather(weather.id) } className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    )) }
                     
                </tbody>
            </table>
        </div>
    )
}
 
export default SearchList