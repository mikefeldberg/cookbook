## Backlog

### CreateRecipe/UpdateRecipe

on photo upload, client-side error:

```Access to XMLHttpRequest at 'https://cookbook-test-bucket.s3.amazonaws.com/' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.```

```VM14:1 POST https://cookbook-test-bucket.s3.amazonaws.com/ net::ERR_FAILED```

### StarRating

- add persistent "hover" state so that stars with (i) < currently hovered-over (i) will appear hovered-over
- disable rating when comments are disabled

### Responsiveness

### Nav styling

### Misc

- live refresh for login/logout mutations
- delete recipe/comment confirmation clickable area (currently must click directly on text; no handler on containing element)
