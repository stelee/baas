BAAS@leesoft
====

#Backend As A Service
Backend as a Service, or BaaS (sometimes referred to as mBaaS) is best described by a tech analyst who refers to it as “turn-on infrastructure” for mobile and web apps. Basically, it’s a cloud computing category that’s comprised of companies that make it easier for developers to setup, use and operate a cloud backend for their mobile, tablet and web apps.

BaaS providers tend to fall into one of two categories: consumer BaaS or enterprise BaaS. The former focuses largely on “lighter-weight” brand apps (and games), whereas the latter centers on mobilizing sensitive, business-critical data from enterprise systems. As a whole, BaaS providers are disrupting the on-premise “Mobile Enterprise Application Platform,” or MEAP, category, while providing a lot more turn-key functionality for your mobile strategy than traditional API management and Platform as a Service vendors.

#What is BAAS@leesoft
We already have some vendors providing backend service in the public cloud. But there are still the requirements to build the BAAS on the private cloud or you want to build your own web services. BAAS@leesoft provides one of the solutions for you. It is basically a simple framework with which you can build your own backend services as easy as possible. 

BAAS@leesoft provide the following features:

 - Integrated Authentication
 - Extendible router management
 - An easy framework to write the service handler
 - A server side session manager. Different clients can share the same session
 - Hot code deployment support
 - Fast mode support
 
#How to use it
clone from the github

    git clone https://github.com/stelee/baas.git

install

    npm install
    
If you wan to run in the hot code deployment mode, you can run

    npm start
    
If you want to run a fast mode(you need to restart the server whenever you change the router or service handler), you can run

    npm run-script prod
    

#How to configure

There are several option to configure with.
In *config.js* file, you can configure the port number and the location to put the service handler

In *router_table.js*, you can configure the router. with the key, set as the regex of the URL and the value, the name of the service handler.

**Attention**, the URL patterner is a lite version of the regex. You don't need to escape the '/', but you need to escape the other characters if necessary.

In the security folder, there is a file named *securityContex.js*, where you can configure the username, password and the groups to control the user that access to the web service. You can also write your own security handler to handle the user authentication from database or even LDAP. Take a look at the *security/basic.js* to understand how the framework to handle the user authentication.

#How to develope

I have put the example code in the framework to help you to understand how to develop.

## Configure the router.

In the *router_table.js*, you can add your own router

    "/login"			: "login"

That means, you can use http://localhost:9000/login to access the login service handler.

Then, you can write the handler.In the backend_handlers, you can find the *login.js*:

	var Login=function(){
		this.passport=null;
	}
	Login.prototype.auth_get=function(passport)
	{
		this.passport=passport;
		return passport.status;
	}
	Login.prototype.get=function()
	{
		this.response.end(JSON.stringify({
			token : this.passport.token
		}))
	}
	exports.getInstance=function(){
		return new Login();
	}
	
- The get function will handle the GET request;
- The post function will handle the POST request;
- If  * *_get* function has been set, it will make the system to check the authentication of the request and check the privileges if required
- The client can use header[Authentication]="Basic ..." to pass the username and password to the service
- The client can also use header[Authentication]="Token ..." by adding the token from the login service to access other privilege required services and get the server-side session object to get/set the temporary object.

