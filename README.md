## Using Axios for Requests

>>This is just a quick example, best practises were not applied

An application with conditional behavior, main task is to demonstrate the _**Front**_ & _**Back**_ ends interaction using Axios HTTP Client.

Totally 6 requests were covered in this example:
* Register User `/api/v1/auth/register` POST
* Login User `/api/v1/auth/login` POST
* Check Status `/api/v1/auth/me` GET
* Profile `/api/v1/profile` GET
* Profile Edit Mode `/api/v1/profile/edit` GET
* Profile Update `/api/v1/profile/edit` PUT

Registration form requires all input to be filled, except `username`; for login - all fields are mandatory.

Registration form will be hidden, if you have successfully registered new User and Login form will be the only one left. After you successfully logged in (_registration can be skipped, if you have already done this before_), JSON Web Token is provided and saved in the `localStorage`.

When you'll see the label **"Unchecked"** and **"Check Authentication"** button, it means that you are at the last stage. Normally it's done in the app without any user actions required, but in this example for futher clarity, you have to initiate process by pressing the button.

For previous 2 requests (Register & Login) standard headers are applied. However, the **"Check Status"** request is a little bit different. In order to receive status _**200 OK**_ response, you have to send _**authorization data**_. Using token value from localStorage is not enough, a special request header `"Authorization"` must be formed, in this example it's done in the request itself:

```
axios.defaults.headers.common['Authorization'] = "Bearer " + window.localStorage.getItem('token');
```
Later in our practicum project, application will have to check User's status every time new request is formed, otherwise protected routes won't be accessible. In this case, better practise is to make axios modify new request automatically, by using its own _**middleware**_. The idea of middleware functions is to manipulate requests _**before**_ they are handled by the main application logic, in axios a characteristic name `interceptors` is given to them. Here is the example:

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
Back to application. If everything done right, label will change to "Checked!" and user-related info will be provided, proving that this User is indeed authorized and can access protected routes.
Loggin-out procedure is based on removing token and reloading page, which returns us to the initial stage.

Also you can enter the profile section and explore your own `credentials`, your `bookmarks` and even modify your data by entering `Edit Section` by clicking "_**Edit Profile**_"
Current data will be uploaded, including `firstname`, `lastname`, `username` (_not necessary_) and your avatar. All field required are marked with asterisk `*`
Clicking on any avatar inside right section will leave a focus on it, meaning that after update it will chosen as new one.
In order to update user profile valid password must be provided, and after submitting form, you will be redirected back to profile page and see the changes you recently made.