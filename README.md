# Feldberg’s Cookbook

Feldberg’s Cookbook is a recipe sharing site for friends and family.

<img src="https://i.imgur.com/J3k1cPU.jpg" width="400px" />

I wanted to blend my passion for cooking with my desire to demonstrate my backend and frontend skills. Feldberg’s Cookbook is a bifurcated app with production-level infrastructure. The backend is written in Django/Python with a PostgreSQL database and GraphQL and REST endpoints. The frontend is written in React, using React Hooks. The build is dockerized and hosted on AWS Elastic Beanstalk. Authentication is implemented using JWT tokens and user photo uploads are stored in S3. There are two environments: development and production. Deployment to both is managed by Travis.ci for continuous integration/deployment.

## Backlog

### Responsiveness

### Styling

### Error Handling

### Recipes
- Upload & display multiple photos
- Select "hero" photo
- Batch file upload

### Profile
- User photo upload

### Nav/Search
- Sorting
- Pagination
- Selectable search fields in fuzzy search

### Misc
- Fix clickable area for delete recipe/comment confirmation (currently must click directly on text; no handler on containing element)