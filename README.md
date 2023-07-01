# Student Loan Disbursements | Method

<img width="381" alt="image" src="https://github.com/aslanshaken/method/assets/62974285/c9b97070-7323-41ea-adf0-50dbb6fc922b">


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
