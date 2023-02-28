import React, { useState, useCallback } from 'react';
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

    const handleLoad = useCallback((map) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    map.panTo({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error(error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const handleSelect = useCallback(
        async (value) => {
            const results = await geocodeByAddress(value);
            const latLng = await getLatLng(results[0]);
            setAddress(value);
            setUserLocation(latLng);
        },
        []
    );

    const handleChange = useCallback((value) => {
        setAddress(value);
    }, []);

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
                onLoad={handleLoad}
            />
        </LoadScript>
    );
}

export default Map;
