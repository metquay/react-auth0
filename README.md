A react wrapper around auth0 js so that we can use custom screens. 

#Refer to these documents : 
1. https://auth0.com/docs/libraries/auth0js
2. https://auth0.github.io/auth0.js/


Things we did : 
1. isLoading : A loding state which becomes true untill things are resolved.
2. isAuthenticated : A state which determine if the user is authenticated.
3. user : The user state which contains the user details. 
4. error : The error state for finding the issue.
5. getAccessToken : To retreive the access token of the logged in user
6. signup : A function used for signing up new users.
7. login : A function for logging in existing users.
8. logout : A function for loggin out users.
9. Auth0Provider : A provider where developers should add the config for webAuth initialization
10. withAuthenticationRequired : A higher order component used to wrap component to only allow access to logged in users.


Need to do : 
1. Error Handling
2. Email already exists
3. Faster Respose time (Loading should be decreased)