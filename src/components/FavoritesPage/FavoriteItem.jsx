import { useDispatch } from 'react-redux';
import React, { useState } from 'react';

function FavoriteItem({ item }) {

    return (
        <li>
            {item.address}
        </li>
    )
}

export default FavoriteItem;