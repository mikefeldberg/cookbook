import React, { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';

import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
// import Dropdown from 'react-bootstrap/Dropdown';
// import DropdownButton from 'react-bootstrap/DropdownButton';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { SEARCH_RECIPES_QUERY } from '../../queries/queries';

const ProfileNav = ({ setSearchResults }) => {
    const client = useApolloClient();
    const [searchTerms, setSearchTerms] = useState('');
    const [placeholder, setPlaceholder] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        console.log(searchTerms)
        const res = await client.query({
            query: SEARCH_RECIPES_QUERY,
            variables: { searchTerms },
            fetchPolicy: 'network-only',
        });
        setSearchResults(res.data.recipes);
        setPlaceholder(searchTerms)
        setSearchTerms('')
    };

    return (
        <ButtonToolbar className="justify-content-between mb-4 mx-auto" aria-label="Toolbar with Button groups">
            <ButtonGroup className="mr-2" aria-label="First group">
            </ButtonGroup>
            <InputGroup>
                <FormControl
                    type="text"
                    placeholder={placeholder}
                    aria-label="Input group example"
                    aria-describedby="btnGroupAddon"
                    value={searchTerms}
                    onChange={e => setSearchTerms(e.target.value)}
                />
                <InputGroup.Append>
                    <Button onClick={e => handleSubmit(e)} variant="info">Search</Button>
                </InputGroup.Append>
            </InputGroup>
        </ButtonToolbar>
    );
};

export default ProfileNav;
