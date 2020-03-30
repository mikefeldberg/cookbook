import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { SEARCH_RECIPES_QUERY } from '../../queries/queries';

const RecipeNav = ({ setSearchResults }) => {
    const client = useApolloClient();
    const [search, setSearch] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(search)
        const res = await client.query({
            query: SEARCH_RECIPES_QUERY,
            variables: { search },
            fetchPolicy: 'network-only',
        });
        setSearchResults(res.data.recipes);
        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ recipe nav search results')
        console.log(res)
    };

    return (
        <ButtonToolbar className="justify-content-between mb-4 mx-auto" aria-label="Toolbar with Button groups">
            <ButtonGroup className="mr-2" aria-label="First group">
                <Button variant="secondary">1</Button>
                <Button variant="secondary">2</Button>
                <Button variant="secondary">3</Button>
                <Button variant="secondary">4</Button>
            </ButtonGroup>
            <InputGroup>
                {/* <InputGroup.Prepend> */}
                {/* <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text> */}
                {/* <DropdownButton
                    as={InputGroup.Prepend}
                    variant="outline-secondary"
                    title="Include"
                    id="input-group-dropdown-1"
                >
                    {' '}
                    <Dropdown.Item href="#">Action</Dropdown.Item>
                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                    <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </DropdownButton> */}
                {/* </InputGroup.Prepend> */}
                <FormControl
                    type="text"
                    placeholder="Input group example"
                    aria-label="Input group example"
                    aria-describedby="btnGroupAddon"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <InputGroup.Append>
                    <Button onClick={e => handleSubmit(e)} variant="info">Search</Button>
                </InputGroup.Append>
            </InputGroup>
        </ButtonToolbar>
    );
};

export default RecipeNav;
