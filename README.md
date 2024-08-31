## Using Axios for Auth Requests

>>This is just a quick example, best practises were not applied

A single component app with conditional behavior, main task is to demonstrate the _**Front**_ & _**Back**_ ends interaction using Axios HTTP Client
Forms are rendered depending on stage you are currently at. By default, register and login forms are available.

Totally 3 requests were covered in this example:
* Register User `/api/v1/auth/register` POST
* Login User `/api/v1/auth/login` POST
* Check Status `/api/v1/auth/me` GET

Registration form requires all input to be filled, except `AvatarUrl`; for login - all fields are mandatory. Server will validate values after you click **"Register"** or **"Login"** buttons, all validation rules for these functions you can find in https://github.com/Code-the-Dream-School/gg-pac-team7-back/blob/main/src/middleware/auth.js inside two arrays: `registerValidation` and `loginValidation` respectively. If you still recieving errors, feel free to check `/api/v1/docs` for more detailed info.

Registration form will be hidden, if you have successfully registered new User and Login form will be the only one left. After you successfully logged in (_registration can be skipped, if you have already done this before_), JSON Web Token is provided and saved in the `localStorage`. For these 2 requests (Register & Login) standard headers are applied. 

When you'll see the label **"Unchecked"** and **"Check Authentication"** button, it means that you are at the last stage. Normally it's done in the app without any user actions required, but in this example for futher clarity, you have to initiate process by pressing the button.

However, the **"Check Status"** request is a bit different. In order to receive status _**200 OK**_ response, you have to send _**authorization data**_. Using token value from localStorage is not enough, a special request header `"Authorization"` must be formed, in this example it's done like this:

```
axios.defaults.headers.common['Authorization'] = "Bearer " + window.localStorage.getItem('token');
```
Later in our practicum project, Front-End app will have to check User's status every time new request is formed, otherwise protected routes won't be accessible. In this case, better practise is to make axios configure new request automatically, by using its own _**middleware**_. The idea of middleware functions is to manipulate requests before they are handled by the main application logic, in axios a characteristic name `interceptors` is given to them. Here is the example:

```
...

instance.interceptors.request.use( function (config) {
    config.headers.Authorization = "Bearer "+ window.localStorage.getItem('token')
    return config
}, function (error) {
    return Promise.reject(error)
})

...
```
If everything done right, label will change to "Checked!" and user-related info will be provided, proving that this User is indeed authorized and can access protected routes.

Loggin-out procedure is based on removing token and reloading page, which returns us to the initial stage.

![Auth Stages](https://github.com/lastpwnd/req-example/raw/master/public/testapp.jpg)