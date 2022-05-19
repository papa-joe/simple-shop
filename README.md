# SIMPLE SHOP

A nodejs api that connects buyers to sellers.

### SETUP

Clone the repo and start the local server by running the commands below in the root directory

```
npm install
```

```
npm run serve
```
### HOW IT WORKS

There are 3 sets of api

### AUTH API

This api takes care of authorization endpoint(login and register)

```
url: '.../api/auth/register'
method: POST
params: email, password, account_type(Seller or Buyer)
```

![Alt text](resources/register.png?raw=true "Title")

handles registration, makes sure there are no duplicate users

```
url: '.../api/auth/login'
method: POST
params: email, password
```

![Alt text](resources/login.png?raw=true "Title")

handles login, creates a token that is sent to the user for future authentication

### SELLER API

There are certain things only a seller can do when they successfully log in

```
url: '.../api/seller/create-catalog'
method: POST
body: name, price, productImage
authorization: Bearer token
```

![Alt text](resources/create-catalog.png?raw=true "Title")

since the specification states that a seller can only create one catalog, it means all the sellers products will be in one catalog so instead of creating another catalog table then linking it to seller and products, i just allow sellers upload products directly to products table and link it to the seller.

Token tells us if the current user is aseller or a buyer(only seller account can add product), this route takes in product name, price and image, it grabs the sellerid directly from the token and saves it.

```
url: '.../api/seller/edit-product/:id'
method: PATCH
body: name, and/or price
params: id(seller id)
authorization: Bearer token
```

![Alt text](resources/edit-product.png?raw=true "Title")

This route allows a seller to edit products they own, a seller cannot edit another sellers product

```
url: '.../api/seller/delete-product/:id'
method: DELETE
params: id(product id)
```

![Alt text](resources/delete-product.png?raw=true "Title")

This route allows a seller to delete products they own, a seller cannot delete another sellers product.

```
url: '.../api/seller/orders/:id'
method: GET
params: id(seller id)
```

This route allows a seller to see all orders for their products

### BUYER API

```
url: '.../api/buyer/list-of-sellers'
method: GET
params: 
```

![Alt text](resources/sellers-list.png?raw=true "Title")

this route allows buyers to see all available sellers on the platform

```
url: '.../api/buyer/seller-catalog/:seller_id'
method: GET
params: seller_id
```

![Alt text](resources/catalog.png?raw=true "Title")

This route allows only a buyer account to see list of products owned by a seller with the seller_id provided.

```
url: '.../api/buyer/create-order/:seller_id'
method: POST
params: seller_id
body: productid(an array of product ids)
```

![Alt text](resources/orders.png?raw=true "Title")

This route allows user to make an order from a particular seller, it checks if the order being sent contains products owned by the seller.

This route is limited because buyer can only send order to one seller at a time, this can be fixed by building a proper cart and checking out system


### IMPROVEMENTS

1. check if sellerid supplied during search for sellers product is actually a seller.
2. Add buyer id to orders so they can track their orders
3. check if account_type during registration is actually Buyer or Seller
4. there should be check to see if the seller requesting for orders id actually the owner of those orders
5. so much more...