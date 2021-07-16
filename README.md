<p align="center">
  <img style="align: center;" width="200" height="200" src="https://github.com/osmannkartall/surveyme/blob/master/assets/icon.png" />
</p>

# SurveyMe

SurveyMe is an application that allows you to create surveys and share them for anonymous participation by others. Developed using React Native and Firebase services.

## Architecture

**Client:** React Native
- [react-native-paper](https://github.com/callstack/react-native-paper): components(Menu, Modal, List, Button, TextInput...)
- [react-navigation](https://github.com/react-navigation): navigation
- [react-hook-form](https://github.com/react-hook-form/react-hook-form): client-side form validation
- [react-native-async-storage](https://github.com/react-native-async-storage/async-storage): storing email address and a list of survey participations made on the current device
- [prop-types](https://github.com/facebook/prop-types): prop type check
- React Context: sharing props between components

**Authentication:** Firebase Authentication

**Database:** Firestore

<p align="center">
  <img style="align: center;" width="750" height="500" src="https://github.com/osmannkartall/surveyme/blob/master/assets/surveyme-db-diagram.png" />
</p>

> #### Details
>
> Each survey document has a sub-collection called *published*. Each *published* sub-collection has only a single document. This single document has survey *questions* and a *title* which are accessable by only the survey owner until the survey is published(In other words, it acts like a private object).
>
> The user can mark the new survey as published before sending it to Firestore. If the new survey is sent as published then *published* field of the survey document becomes true. Thus, any anonymous or logged-in user can get access to the document in *published* sub-collection if the given survey code is valid. Otherwise, the value of the *published* field becomes false and only survey owner can get access to that document. The survey code corresponds to the *id* of the document in *published* sub-collection and is created manually before submitting the new survey.
>
> *ownerId* is used to prevent any user from accessing survey and submission documents of other users and participating in their own surveys. It is compared with *uid* values of the documents in users collection.

## Instructions

Clone the project.
```bash
  git clone https://github.com/osmannkartall/surveyme.git
```


1. [Create an emulator using Android Studio](https://docs.expo.io/workflow/android-studio-emulator/) to run the application on an emulator or download [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=www) to run it on a real Android device.

2. [Create a Firestore database in Firebase Console.](https://firebase.google.com/docs/firestore/quickstart)

3. Paste the rules in [firestore.rules](https://github.com/osmannkartall/surveyme/blob/master/src/configs/firestore.rules) file into rules section of your Firestore database.

4. Create a web app in Firebase Console. See [Step 2](https://firebase.google.com/docs/web/setup#register-app).

5. Enable Email/Password sign-in method in Firebase Console/Authentication. Check the [details](https://firebase.google.com/docs/auth).

6. Change the values of [firebaseConfig object](https://github.com/osmannkartall/surveyme/blob/a4864a8dd4723bc9d0eaebb245197f16c2b8591c/src/configs/firebase.jsx#L5) with your project credentials.
```javascript
const firebaseConfig = {
  apiKey: '<your-api-key>',
  authDomain: '<your-authDomain>',
  projectId: '<your-projectId>',
  storageBucket: '<your-storageBucket>',
  messagingSenderId: '<your-messagingSenderId>',
  appId: '<your-appId>',
};
```

7. Install [Node.js and npm](https://nodejs.org/en/download/) if you haven't already.

8. Install expo-cli globally.
```
npm install -g expo-cli
```

9. Install dependencies of the project.
```bash
cd surveyme
npm install
```

10. Start the project.
```bash
expo start

# Note: If expo command not found you may need to add the global prefix to path variable.
# You can run "npm prefix -g" command to get the global prefix.
```

11. Run the app.

```
Android Emulator: Make sure that the emulator is running. Then, press a in terminal.
```

```
Your Android Device: Open Expo Go and scan the QR code seen in terminal/browser.
```

## Features
1. Minimalistic Sign-in, Sign-up and Logout operations with Firebase Authentication
2. Create published or private survey
3. Delete survey and submissions of it
4. Publish the survey created as private to able other users participate in it
5. Participate in a survey anonymously(with/without login)
6. Display surveys with their date of creation
7. Display details of selected survey(survey code, survey questions, received submissions...)

## Demo

<p>
  <img style="align: center;" width="250" height="500" src="https://github.com/osmannkartall/surveyme/blob/master/assets/surveyme-demo.gif" />
</p>

[Video](https://drive.google.com/file/d/1DIyq8xZfCWkZ4k3AKT54qUXCTcZgbRyh/view) for detailed demo with multiple emulators

## TODO

1. Optimize the number of get and exist requests in rules and cache surveys and submissions
2. Complete the prop type validation
3. User Profile Screen
4. Delete/Modify user account feature
5. Update private survey feature
6. Max participants in a survey feature
7. Time-dependent survey feature
