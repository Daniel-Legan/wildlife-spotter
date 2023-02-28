import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

function AddressAutocomplete() {
    const [address, setAddress] = useState('');
    const [latLng, setLatLng] = useState({ lat: null, lng: null });

    const handlePlaceSelect = (place) => {
        setAddress(place.formatted_address);
        setLatLng({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            libraries={['places']}
        >
            <Autocomplete
                onLoadFailed={() => console.error('Could not load Google Maps API')}
                onPlaceChanged={() => handlePlaceSelect(autocomplete.getPlace())}
            >
                <input placeholder="Enter an address" ref={(ref) => (autocomplete = ref)} />
            </Autocomplete>
            <div>
                <p>Address: {address}</p>
                <p>Lat: {latLng.lat}</p>
                <p>Lng: {latLng.lng}</p>
            </div>
        </LoadScript>
    );
}

export default AddressAutocomplete;