import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';

const MapContainer = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        // getLocation();

        // Get the user's current location
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            // setCurrentLocation({ lat: latitude, lng: longitude });
            setCenter({ lat: latitude, lng: longitude });
            setIsLoaded(true);
            console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        });
    }, []);

    // const getLocation = () => {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function (position) {
    //             var lat = position.coords.latitude;
    //             var lng = position.coords.longitude;
    //             setCenter({ lat, lng });
    //             setIsLoaded(true);
    //             console.log("Latitude: " + lat + ", Longitude: " + lng);
    //         });
    //     } else {
    //         console.log("Geolocation is not supported by this browser.");
    //     }
    // };

    const [isLoaded, setIsLoaded] = useState(false);
    const [selected, setSelected] = useState({});
    const [center, setCenter] = useState({});

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

    const deviceLocationIcon =
        "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    return (
        <>
            {isLoaded &&
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}>

                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={13}
                        center={center}>

                        <Marker position={center} icon={deviceLocationIcon} />

                        {/* {
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
                        } */}
                    </GoogleMap>
                </LoadScript>
            }
        </>
    )
}

export default MapContainer;