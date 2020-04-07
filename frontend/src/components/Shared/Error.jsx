import React from 'react';

const Error = ( {error} ) => {
    return (
        <>
            <div className="mt-3 mx-auto w-50 text-danger">Error: {error}</div>
        </>
    );
};

export default Error;
