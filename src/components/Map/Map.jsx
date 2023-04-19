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

const mapStyles = [
    {
        featureType: "poi",
        elementType: "labels",
        stylers: [
            {
                visibility: "off"
            }
        ]
    },
    {
        featureType: "poi.park",
        elementType: "labels",
        stylers: [
            {
                visibility: "on"
            }
        ]
    }
];

// TO-DO: Show the address from the Favorite List and ADD/REMOVE

function Map() {
    const [userLocation, setUserLocation] = useState(null);
    const [userLocationMarker, setUserLocationMarker] = useState(null);
    const [address, setAddress] = useState('');
    const [addressToSaveDelete, setAddressToSaveDelete] = useState('');
    const [description, setDescription] = useState('');
    const [animalId, setAnimalId] = useState('');
    const [submit, setSubmit] = useState(false);
    const [selected, setSelected] = useState(null);
    const [placeSelected, setPlaceSelected] = useState(false);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [libraries] = useState(['places']);
    const isFavorite = useSelector((store) => store.favorite.isFavorite);
    const centerFavorite = useSelector((store) => store.favorite.centerFavorite);
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
        if (centerFavorite === null) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
            });
        } else {
            setUserLocation({ lat: Number(centerFavorite.lat), lng: Number(centerFavorite.lng) });
        }
    }, []);


    const handleShowUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocationMarker({ lat: latitude, lng: longitude });
            });
        }
        setShowUserLocation(!showUserLocation);
    };

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
            setPlaceSelected(true);
            setAddressToSaveDelete(value)
            setAddress('');
            setUserLocation(latLng);
        },
        []
    );


    const handleSaveFavorite = useCallback(
        async () => {
            const results = await geocodeByAddress(addressToSaveDelete);
            const latLng = await getLatLng(results[0]);
            dispatch({
                type: 'ADD_FAVORITE',
                payload: {
                    placeId: results[0].place_id,
                    address: addressToSaveDelete,
                    lat: latLng.lat,
                    lng: latLng.lng
                }
            });

            setAddress('');
        }, [addressToSaveDelete]);

    const handleRemoveFavorite = useCallback(
        async () => {
            const results = await geocodeByAddress(addressToSaveDelete);
            dispatch({
                type: 'DELETE_FAVORITE',
                payload: {
                    placeId: results[0].place_id
                }
            });
            // setAddress('');
        }, [addressToSaveDelete]);

    const handleChange = useCallback((value) => {
        setAddress(value);
    }, []);

    const handleSubmit = () => {
        setSubmit(true);
    };

    const handleCancel = () => {
        setSubmit(false);
        setDescription('');
        setAnimalId('');
    };

    const handleUserLocation = useCallback(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
        });
    }, []);

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
            <button onClick={handleUserLocation}>Go to My Location</button>
            <button onClick={handleShowUserLocation}>
                {showUserLocation ? 'Hide' : 'Show'} My Location
            </button>
            <PlacesAutocomplete
                value={address}
                onSelect={handleSelect}
                onChange={handleChange}
                searchOptions={{
                    types: ['park']
                }}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Search Places...',
                                className: 'location-search-input',
                            })}
                        />
                        {!isFavorite && placeSelected && <button onClick={handleSaveFavorite}>Save Location to Favorites</button>}
                        {isFavorite && placeSelected && <button onClick={handleRemoveFavorite}>Remove Location from Favorites</button>}
                        {placeSelected &&
                            <p>{addressToSaveDelete}</p>
                        }
                        {suggestions.length > 0 && (
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
                        )}
                    </div>
                )}
            </PlacesAutocomplete>

            <GoogleMap
                mapContainerStyle={mapContainerStyle}

                center={userLocation || null}
                zoom={13}
                onClick={handleMapClick}
                options={{
                    mapTypeId: 'terrain',
                    streetViewControl: false,
                    clickableIcons: false,
                    styles: mapStyles,
                    zoomControlOptions: {
                        position: 9
                    }
                }}
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
                            case 4:
                                iconUrl = '/svg/bird-crane-shape-svgrepo-com.svg';
                                break;
                            case 5:
                                iconUrl = '/svg/bird-osprey-shape-svgrepo-com.svg';
                                break;
                            case 6:
                                iconUrl = '/svg/bird-plover-side-shape-svgrepo-com.svg';
                                break;
                            case 7:
                                iconUrl = '/svg/bird-shape-svgrepo-com.svg';
                                break;
                            case 8:
                                iconUrl = '/svg/buffalo-wild-beast-silhouette-svgrepo-com.svg';
                                break;
                            case 9:
                                iconUrl = '/svg/deer-shape-svgrepo-com.svg';
                                break;
                            case 10:
                                iconUrl = '/svg/echidna-mammal-animal-side-view-shape-svgrepo-com.svg';
                                break;
                            case 10:
                                iconUrl = '/svg/echidna-mammal-animal-side-view-shape-svgrepo-com.svg';
                                break;
                            case 11:
                                iconUrl = '/svg/fox-shape-svgrepo-com.svg';
                                break;
                            case 12:
                                iconUrl = '/svg/frog-shape-svgrepo-com.svg';
                                break;
                            case 13:
                                iconUrl = '/svg/gull-bird-flying-shape-svgrepo-com.svg';
                                break;
                            case 14:
                                iconUrl = '/svg/horse-black-shape-svgrepo-com.svg';
                                break;
                            case 15:
                                iconUrl = '/svg/mammal-animal-shape-of-a-platypus-svgrepo-com.svg';
                                break;
                            case 16:
                                iconUrl = '/svg/mouse-mammal-animal-shape-svgrepo-com.svg';
                                break;
                            case 17:
                                iconUrl = '/svg/opossum-mammal-animal-silhouette-svgrepo-com.svg';
                                break;
                            case 18:
                                iconUrl = '/svg/owl-bird-shape-svgrepo-com.svg';
                                break;
                            case 19:
                                iconUrl = '/svg/pigeon-bird-shape-svgrepo-com.svg';
                                break;
                            case 20:
                                iconUrl = '/svg/prairie-dog-silhouette-svgrepo-com.svg';
                                break;
                            case 21:
                                iconUrl = '/svg/quail-bird-shape-svgrepo-com.svg';
                                break;
                            case 22:
                                iconUrl = '/svg/rabbit-shape-svgrepo-com.svg';
                                break;
                            case 23:
                                iconUrl = '/svg/running-dog-silhouette-svgrepo-com.svg';
                                break;
                            case 24:
                                iconUrl = '/svg/slug-shape-svgrepo-com.svg';
                                break;
                            case 25:
                                iconUrl = '/svg/snake-svgrepo-com.svg';
                                break;
                            case 26:
                                iconUrl = '/svg/sphinx-top-view-silhouette-svgrepo-com.svg';
                                break;
                            case 27:
                                iconUrl = '/svg/turkey-bird-shape-from-side-view-svgrepo-com.svg';
                                break;
                            case 28:
                                iconUrl = '/svg/turtle-silhouette-svgrepo-com.svg';
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
                {showUserLocation &&
                    <Marker
                        position={userLocationMarker}
                    >
                    </Marker>
                }
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
                        <button>Add Marker</button>
                    </div>
                </form>
                :
                <div>
                    <p>CLICK ON MAP TO ADD MARKER</p>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            }
        </LoadScript>
    );
}

export default Map;