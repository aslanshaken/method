# Student Loan Disbursements | Method

### Technologies
Next | TypeScript | MUI | Prisma

### Services
https://methodfi.com


-----

### Install all dependencies

    yarn install

### Migrate Database
- configure .env file to specify postgresql database
  
      DATABASE_URL=postgresql://[user]:[pass]@[host]:[port]/[dbname]?schema=public

- run migrate command to generate tables

      yarn db:migrate

### Run the project for dev or prod

    yarn dev

  or
    
    yarn start

### Testing

You can use the example file: `/public/sample file/small.xml`

open http://localhost:3000 !