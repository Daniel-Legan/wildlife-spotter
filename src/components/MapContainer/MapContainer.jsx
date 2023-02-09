import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';

// http://localhost:3000/#/home
// require('dotenv').config(); ???

const MapContainer = () => {
    const dispatch = useDispatch();

    useEffect(() => {

    }, []);

    const user = {
        location: {
            lat: 41.4065,
            lng: 2.162
        }
    };

    const [selected, setSelected] = useState({});
    const [center, setCenter] = useState(user.location);

    const onSelect = item => {
        setSelected(item);
        setCenter(item.location);
        console.log('setSelected', item);
        console.log('setCenter', item.location);
    }

    const mapStyles = {
        height: "70vh",
        width: "100%",
    };

    // const defaultCenter = {
    //     lat: 41.3851, lng: 2.1734
    // }

    const userIcon =
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    return (
        <>
            <h1>User's Location: lat: {user.location.lat}, lng: {user.location.lng}</h1>

                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={center}>

                    <Marker key={user.name} position={user.location} icon={userIcon} onClick={() => onSelect(user)} />

                    {
                        selected.location &&
                        (
                            <InfoWindow
                                position={selected.location}
                                clickable={true}
                                onCloseClick={() => setSelected({})}
                            >
                                <div>
                                    <p>lat: ({Number(selected.location.lat)})</p>
                                    <p>lng: ({Number(selected.location.lng)})</p>
                                </div>
                            </InfoWindow>
                        )
                    }

                </GoogleMap>

        </>
    )
}

export default MapContainer;