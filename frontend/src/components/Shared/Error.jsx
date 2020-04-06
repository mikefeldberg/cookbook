import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Error = ( {error} ) => {
    return (
        <>
            <div className="mt-3 mx-auto w-50 text-danger">Error: {error}</div>
        </>
    );
};

export default Error;
