import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { GoogleMap, Marker, InfoWindow, LoadScript } from '@react-google-maps/api';


const mapContainerStyle = {
    width: '100%',
    height: '70vh',
};

function Map() {
    const [userLocation, setUserLocation] = useState(null);
    const [address, setAddress] = useState('');
    const [markerData, setMarkerData] = useState(null);
    const [description, setDescription] = useState("");
    const [infoWindow, setInfoWindow] = useState(null);
    const [submit, setSubmit] = useState(false);

    const favorite = useSelector((store) => store.favorite.isFavorite);
    const dispatch = useDispatch();

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            // map.panTo({ lat: latitude, lng: longitude });
            // console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        });
    }, []);

    const handleSelect = useCallback(
        async (value) => {
            // console.log(value); // suggested result clicked
            const results = await geocodeByAddress(value);
            const latLng = await getLatLng(results[0]);
            // console.log(results[0].formatted_address);
            // console.log(results[0].place_id);
            // console.log(latLng);
            dispatch({
                type: 'CHECK_PLACE_ID',
                payload: {
                    placeId: results[0].place_id
                }
            });
            setAddress(value);
            setUserLocation(latLng);
        },
        []
    );

    const handleSave = useCallback(async () => {
        const results = await geocodeByAddress(address);
        const latLng = await getLatLng(results[0]);
        // console.log(address);
        // console.log(results[0].formatted_address);
        // console.log(results[0].place_id);
        // console.log(latLng);
        dispatch({
            type: 'ADD_FAVORITE',
            payload: {
                placeId: results[0].place_id,
                address: address,
                lat: latLng.lat,
                lng: latLng.lng
            }
        });
    }, [address]);

    const handleChange = useCallback((value) => {
        setAddress(value);
    }, []);

    const handleMarkerClick = () => {
        setInfoWindow(markerData);
    };

    const handleInfoWindowClose = () => {
        setInfoWindow(null);
    };

    const handleSubmit = () => {
        setSubmit(true);
    }

    const handleCancel = () => {
        setSubmit(false);
        setDescription("");
    }

    const handleMapClick = (event) => {
        if (description !== "" && submit === true) {
            const newMarkerData = { lat: event.latLng.lat(), lng: event.latLng.lng(), description };
            setMarkerData(newMarkerData);
            setDescription("");
            setSubmit(false);
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={['places']}
        >
            <PlacesAutocomplete
                value={address}
                onSelect={handleSelect}
                onChange={handleChange}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places...',
                                className: 'location-search-input',
                            })}
                        />
                        {!favorite ? <button onClick={handleSave}>Save</button> : null}
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map((suggestion) => {
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, { style })}
                                        key={suggestion.placeId}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={userLocation || null}
                zoom={13}
                onClick={handleMapClick}
            >
                {markerData && (
                    <Marker
                        position={markerData}
                        onClick={handleMarkerClick}
                    >
                        {infoWindow === markerData && (
                            <InfoWindow onCloseClick={handleInfoWindowClose}>
                                <div>{markerData.description}</div>
                            </InfoWindow>
                        )}
                    </Marker>
                )}
            </GoogleMap>
            {!submit ?
                <form
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label>
                            Description:
                            <input required type="text" value={description} onChange={handleDescriptionChange} />
                        </label>
                        <button>Save</button>
                    </div>
                </form>
                :
                <div>
                    <p>Click on map to add marker</p>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            }
        </LoadScript>
    );
}

export default Map;
