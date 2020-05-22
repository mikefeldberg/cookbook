import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';

import DeleteRecipe from './DeleteRecipe';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <span
        ref={ref}
        onClick={(e) => {
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
                    (child) => !value || child.props.children.toLowerCase().startsWith(value)
                )}
            </ul>
        </div>
    );
});

const RecipeToolbar = ({ recipe }) => {
    return (
        <Row noGutters>
            <Link style={{ textDecoration: 'none' }} to={`/recipes/${recipe.id}/edit`} className="mr-2">
                <i className="clickable editIcon fa-sm fas fa-pen"></i>
            </Link>
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                    <i className="clickable deleteIcon fa-sm far fa-trash-alt"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu as={CustomMenu}>
                    <Dropdown.Item disabled>Are you sure?</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="p-0">
                        <DeleteRecipe recipe={recipe} />
                    </Dropdown.Item>
                    <Dropdown.Item className="p-0">
                        <ButtonGroup className="w-100">
                            <Button
                                variant="light-outline"
                                className="rounded-0 text-left"
                            >
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </Row>
    );
};

export default RecipeToolbar;
