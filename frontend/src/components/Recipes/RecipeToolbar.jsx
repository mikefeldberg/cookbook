import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';

import DeleteRecipe from './DeleteRecipe';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        ref={ref}
        onClick={e => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </span>
));

const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value] = useState('');

    return (
        <div ref={ref} style={style} className={className} aria-labelledby={labeledBy}>
            <ul className="list-unstyled">
                {React.Children.toArray(children).filter(
                    child => !value || child.props.children.toLowerCase().startsWith(value)
                )}
            </ul>
        </div>
    );
});

const RecipeToolbar = ({ recipe, history }) => {
    return (
        <Row noGutters>
            <Link to={`/recipes/${recipe.id}/edit`} className="mr-2">{<i className="fas fa-edit text-secondary"></i>}</Link>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    <i className="far fa-trash-alt"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                    <Dropdown.Item disabled eventKey="0">
                        Are you sure?
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="1">
                        <DeleteRecipe recipe={recipe} history={history} />
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">Cancel</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Row>
    );
};

export default RecipeToolbar;
