# Example NodeJS Demo
This demo shows an example of how to use AuthGuard to handle user credentials
and authentication. It shouldn't be used an example of how to write a Node server.
The project consists of an AuthGuard distribution which uses [MongoDB DAL
implementation](https://github.com/AuthGuard/Mongo-DAL).

## Running the Project
Before running the project, make sure that you have MongoDB installed and running.

### Running AuthGuard
An AuthGuard distribution is provided as a Gradle application. To run the server
you can use the following command
```
./gradlew run
or alternatively just
gradle run
```

You can also modify the configuration file to change the behavior. Configuration
documentation is available [here](https://authguard.github.io/config/).

### Bootstrapping an Admin
In order to be able to call AuthGuard to create an admin account and application
you need to have the One-Time Admin (OTA) username and password used by the
running distribution. The OTA can only be used to create other accounts and
credentials and cannot be used to call any of the other API endpoints.

1. Create admin account
```
POST /accounts
{
	"roles": [
		"authguard_admin"
	]
}
```
The default admin role is authguard_admin but it could be different depending
on the configuration of the distribution.

2. Create admin credentials
```
POST /credentials
{
	"accountId": "<account ID>",
	"identifiers": [
		{
			"identifier": "<admin username>",
			"type": "USERNAME"
		}
	],
	"plainPassword": "password"
}
```

3. Create admin application
```
POST /apps
{
	"accountId": "<account ID>",
	"roles": [
		"authguard_admin_client"
	]
}
```

4. Generate an API key for the application
```
POST /keys/<app ID>
```
You can now use that API key in config/authguard.json. You also need to know the
secret used by the AuthGuard distribution. The test distributions use HMAC256
algorithm with the secret of `FKvL11DI5rwgt51QgB3CVob3oWYrFNBzF0ROvu9Yaj8`.

## Running the Server
`PORT=<set the port> npm start`

## Authentication Flow
The demo in its current state is pretty basic. It use multi-credential support
of AuthGuard to allow users to log in using either their email or username. It
also uses AuthGuard ID token (not to be confused with OpenID Connect ID tokens)
to authenticate users.

Upon successful login, a user is given a token. That token is then stored in a
cookie and is sent back to the server with every request. Users can only view
the dashboard page if their token is valid. Otherwise, they get redirected to a
login page.
