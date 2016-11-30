# hubspot-pdf-creator

## Pre-requisites

You need to have a Redis server installed and running on the local environment. You can download and install redis using `brew` by running

```
$ brew install redis
```

and start the service using

```
$ redis-server
```

Once `redis` is installed and running, continue with the installation steps below.

## Installation

```
$ npm install
$ npm start
```

## Creating PDF

* Use Postman (or another API service) to create a `POST` request to `http://localhost/api/v1/create` with the following headers:

```
Authorization: Bearer <APPLICATION_KEY>
```

(see below for generating application keys) and the following payload:

```
{
	"fields": {
		"ejsFile": "../templates/default.ejs",
		"properties": {
			"user": {
				"name": "Stephen"
			}
		}
	}
}
```

* You'll get a response like this

```
{
  "filename": "http://localhost:3000/api/v1/download/58e0ebe9-49a5-43da-9db6-0f3bbd846609"
}
```

* Use the link in the URL to download the PDF directly. If using this in a single-page application you'll need to `location.href=${filename}` redirect the browser to download the PDF.

## Generating application keys

To ensure that only signed applications can post to this endpoint, you need to generate an application key and save it to the application. Here's the process

* Run `npm run gen-key`
* Enter your application name (used to identify which app is making the request)
* Make note of the generated application key
* This updates `lib/app-keys.json`, so you need to commit this file back to the repo and deploy to Heroku.


## Downloading at a later stage

* The download will be retained in memory for `n` days (configurable as a `redis` TTL value)

## Future

* Move to a Heroku application
