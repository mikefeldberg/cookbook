## Backlog

### CreateRecipe/UpdateRecipe

on photo upload, client-side error:

```Access to XMLHttpRequest at 'https://cookbook-test-bucket.s3.amazonaws.com/' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.```

```VM14:1 POST https://cookbook-test-bucket.s3.amazonaws.com/ net::ERR_FAILED```

### Comment "updated at"

created_at and updated_at are off by microseconds. Need to lower threshold to at least one second

### StarRating

add persistent "hover" state so that stars with (i) < currently hovered-over (i) will appear hovered-over