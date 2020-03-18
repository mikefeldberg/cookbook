import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import DeleteRecipe from './DeleteRecipe';

const RecipeToolbar = ({ recipe, history }) => {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    return (
        <>
            <Link to={`/recipes/${recipe.id}/edit`} className="mr-2">
                {<i className="fas fa-edit text-secondary"></i>}
            </Link>
            {/* <i ref={target} onClick={() => setShow(!show)} className="fas fa-trash text-danger"></i> */}
            <i ref={target} onClick={() => setShow(!show)} className="far fa-trash-alt"></i>
            <Overlay target={target.current} show={show} placement="right">
                {props => (
                    <Tooltip onClick={() => console.log('clicked')} id="overlay-example" {...props}>
                        Confirm delete
                    </Tooltip>
                )}
            </Overlay>
        </>
    );
};

export default RecipeToolbar;
