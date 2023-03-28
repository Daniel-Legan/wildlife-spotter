import React from 'react';
import { useDispatch } from 'react-redux';

function FavoriteItem({ item }) {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch({
            type: 'DELETE_FAVORITE',
            payload: {
                placeId: item.place_id
            }
        });
    };

    return (
        <li>
            {item.address}
            <button onClick={handleDelete}>Delete</button>
        </li>
    );
}

export default FavoriteItem;
