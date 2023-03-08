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
    const [description, setDescription] = useState('');
    const [animalId, setAnimalId] = useState('');
    const [submit, setSubmit] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [selected, setSelected] = useState(null);
    const [libraries] = useState(['places']);
    const favorite = useSelector((store) => store.favorite.isFavorite);
    const markers = useSelector((store) => store.markers.markers);
    const animals = useSelector((store) => store.markers.animals);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: 'FETCH_MARKERS'
        });
        dispatch({
            type: 'FETCH_ANIMALS'
        });
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
        });
    }, []);

    const handleSelect = useCallback(
        async (value) => {
            const results = await geocodeByAddress(value);
            const latLng = await getLatLng(results[0]);
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

    const handleSaveFavorite = useCallback(
        async () => {
            const results = await geocodeByAddress(address);
            const latLng = await getLatLng(results[0]);
            dispatch({
                type: 'ADD_FAVORITE',
                payload: {
                    placeId: results[0].place_id,
                    address: address,
                    lat: latLng.lat,
                    lng: latLng.lng
                }
            });
            setAddress('');
        }, [address]);

    const handleUnsaveFavorite = useCallback(
        async () => {
            const results = await geocodeByAddress(address);
            dispatch({
                type: 'DELETE_FAVORITE',
                payload: {
                    placeId: results[0].place_id,
                }
            });
            setAddress('');
        }, [address]);

    const handleChange = useCallback((value) => {
        setAddress(value);
    }, []);

    const handleSubmit = () => {
        setSubmit(true);
    }

    const handleCancel = () => {
        setSubmit(false);
        setDescription('');
        setAnimalId('');
    }

    const handleMapClick = (event) => {
        if (description !== '' && animalId !== '' && submit === true) {
            const newMarkerData = { animalId: animalId, lat: event.latLng.lat(), lng: event.latLng.lng(), description };
            dispatch({
                type: 'ADD_MARKER',
                payload: {
                    newMarkerData: newMarkerData
                }
            });
            setDescription('');
            setAnimalId('');
            setSubmit(false);
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    return (
        <LoadScript
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
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
                        {!favorite ? <button onClick={handleSaveFavorite}>Save</button> : <button onClick={handleUnsaveFavorite}>Unsave</button>}
                        {/* {!favorite ? <button onClick={handleSave}>Save</button> : null} */}
                        {showMessage && <p>Saved!</p>}
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
                {markers.length > 0 &&
                    markers.map((marker) => {
                        let iconUrl;
                        switch (marker.animal_id) {
                            case 1:
                                iconUrl = '/svg/bear-black-shape-svgrepo-com.svg';
                                break;
                            case 2:
                                iconUrl = '/svg/moose-shape-svgrepo-com.svg';
                                break;
                            case 3:
                                iconUrl = '/svg/squirrel-shape-svgrepo-com.svg';
                                break;
                            default:
                                iconUrl = null;
                                break;
                        }
                        return (
                            <Marker
                                key={`${marker.lat}-${marker.lng}`}
                                position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
                                icon={{
                                    url: iconUrl,
                                    scaledSize: { width: 20, height: 20 }
                                }}
                                onClick={() => {
                                    setSelected(marker);
                                }}
                            >
                                {selected === marker && (
                                    <InfoWindow
                                        onCloseClick={() => {
                                            setSelected(null);
                                        }}
                                    >
                                        <div>{marker.description}</div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        );
                    })}
            </GoogleMap>

            {!submit ?
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="description">
                            Description:
                            <input
                                required
                                type="text"
                                name="description"
                                placeholder="Enter Description..."
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                        </label>
                        <label htmlFor="animal-select">Animal:</label>
                        <select value={animalId} onChange={(event) => setAnimalId(event.target.value)} required>
                            <option value="" disabled>Select Animal</option>
                            {animals.map((animal) => (
                                <option key={animal.id} value={animal.id}>
                                    {animal.animal}
                                </option>
                            ))}
                        </select>
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