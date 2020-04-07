## Backlog

### CreateRecipe/UpdateRecipe

on photo upload, client-side error:

```Access to XMLHttpRequest at 'https://cookbook-test-bucket.s3.amazonaws.com/' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.```

```VM14:1 POST https://cookbook-test-bucket.s3.amazonaws.com/ net::ERR_FAILED```

### Responsiveness

### Styling

### Recipes
- Upload multiple photos
- Select "hero" photo 
- Batch file upload

### Profile
- User info section
- User photo upload

### Validation
- Login
- Register
- Create recipe
- Update recipe

### Nav/Search
- Dead recipes should redirect to root
- Sorting
- Pagination
- Selectable search fields in fuzzy search

### Error Handling
- Login
- Register
- Create recipe
- Update recipe

### Misc
- Make email unique
- Fix clickable area for delete recipe/comment confirmation (currently must click directly on text; no handler on containing element)
- Fix recipedetails rating update; does not live-update when comment is added/modified