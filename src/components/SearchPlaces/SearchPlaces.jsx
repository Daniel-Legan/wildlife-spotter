import React from 'react';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';

function SearchPlaces({
    address,
    centerFavorite,
    onSelect,
    onChange,
    placeSelected,
    isFavorite,
    addressToSaveDelete,
    handleCenterLocation,
    handleRemoveFromFavoriteList,
    handleRemoveFavorite,
    handleSaveFavorite,
    setCenterFavoriteLocation
}) {
    return (
        <PlacesAutocomplete
            value={address}
            onSelect={onSelect}
            onChange={onChange}
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
                    {placeSelected && (
                        <>
                            {isFavorite ? (
                                <button onClick={handleRemoveFavorite}>Remove Location from Favorites</button>
                            ) : (
                                <button onClick={handleSaveFavorite}>Save Location to Favorites</button>
                            )}
                            {addressToSaveDelete && <p onClick={handleCenterLocation}>{addressToSaveDelete}</p>}
                        </>
                    )}
                    {centerFavorite && (
                        <>
                            <button onClick={handleRemoveFromFavoriteList}>Remove Location from Favorites</button>
                            <p onClick={setCenterFavoriteLocation}>{centerFavorite.address}</p>
                        </>
                    )}
                    {addressToSaveDelete && !placeSelected && (
                        <>
                            {!isFavorite && <button onClick={handleSaveFavorite}>Save Location to Favorites</button>}
                            {isFavorite && <button onClick={handleRemoveFavorite}>Remove Location from Favorites</button>}
                            <p onClick={handleCenterLocation}>{addressToSaveDelete}</p>
                        </>
                    )}
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
    );
}

export default SearchPlaces;
