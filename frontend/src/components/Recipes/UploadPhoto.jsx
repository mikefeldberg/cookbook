import React, { useState } from 'react';

const UploadPhoto = () => {
    const [file, setFile] = useState(null);

    const getPresignedPostData = async () => {
        const response = await fetch('http://localhost:8000/upload/');
        const json = await response.json();
        return json;
    };

    const uploadFileToS3 = (presignedPostData, file) => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            Object.keys(presignedPostData.fields).forEach(key => {
                formData.append(key, presignedPostData.fields[key]);
            });

            // Actual file has to be appended last.
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', presignedPostData.url, true);
            xhr.send(formData);
            xhr.onload = function() {
                this.status === 204 ? resolve() : reject(this.responseText);
            };
        });
    };

    const getFile = e => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFile = files[0];
            setFile({ newFile });
        }
    };

    const handleUpload = async e => {
        e.preventDefault();
        const presignedPostData = await getPresignedPostData();
        uploadFileToS3(presignedPostData, file.newFile);
    };

    return (
        <form onSubmit={handleUpload}>
            <label>Choose file</label>
            <input onChange={getFile} type="file" />
            <button>Submit</button>
        </form>
    );
};

export default UploadPhoto;
