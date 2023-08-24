import React from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

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

function GoogleMapComponent({
    setSelected,
    userLocationMarker,
    showUserLocation,
    userLocation,
    markers,
    selected,
    handleMapClick,
    handleEditClick,
    handleCancelEditClick,
    handleSaveClick,
    handleEditDescriptionChange,
    editable,
    editedItem,
    removeMarker
}) {
    return (
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
                                        setEditable(false);
                                    }}
                                >
                                    {editable ? (
                                        <div>
                                            <input type="text" name="description" value={editedItem.description} onChange={handleEditDescriptionChange} />
                                            <button onClick={handleSaveClick}>Save</button>
                                            <button onClick={handleCancelEditClick}>Cancel</button>
                                        </div>
                                    ) : (
                                        <div>
                                            <p>{marker.description}</p>
                                            <p>Updated: {new Date(marker.time).toLocaleString()}</p>
                                            <button onClick={handleEditClick}>Edit</button>
                                            <button onClick={() => removeMarker(marker)}>Remove Marker</button>
                                        </div>
                                    )}
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
    );
}

export default GoogleMapComponent;
