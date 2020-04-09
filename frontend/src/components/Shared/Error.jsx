import React from 'react';

const Error = ( {error} ) => {
    return (
        <>
            <div className="mt-3 text-danger">Error: {error}</div>
        </>
    );
};

export default Error;
