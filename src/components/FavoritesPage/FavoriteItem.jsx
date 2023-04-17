import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function FavoriteItem({ item }) {
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = () => {
        dispatch({
            type: 'DELETE_FAVORITE',
            payload: {
                placeId: item.place_id
            }
        });
    };

    const handleLocation = () => {
        dispatch({
            type: 'SET_CENTER_FAVORITE',
            payload: item
        });
        history.push('/user');
    };

    return (
        <>
            <li onClick={handleLocation}>
                {item.address}
            </li>
            <button onClick={handleDelete}>Delete</button>
        </>
    );
}

export default FavoriteItem;