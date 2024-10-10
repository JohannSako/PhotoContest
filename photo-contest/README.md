# Photo Contest Web Application

## Description

Photo Contest is a web application that allows users to create and participate in daily photo contests with their friends. Each day, a random theme is chosen, and users can upload their photos, vote for their favorite submissions, and see who wins the contest. The application is built with Next.js and uses MongoDB for data storage.

## Features

- **Splash Screen**: Displays the application logo for 2-3 seconds before redirecting to the login/register screen.
- **Authentication**:
  - **Login**: Users can log in with their email/username and password.
  - **Register**: Users can create a new account by providing a profile picture, name, email, and password.
- **Home**: Displays the list of games the user is participating in, with options to add a new game or access settings.
- **Game Management**:
  - **Add Photo**: Users can upload their photo if the contest is in the UPLOADING state.
  - **Vote**: Users can vote for their favorite photo if the contest is in the VOTING state.
  - **Game Master Settings**: The game master can change the game title, remove participants, delete the game, change theme categories, and set uploading and voting times.
- **Calendar**: Displays the participation history for each day of the month, with options to view past contests and results.
- **Settings**: Allows users to log out or delete their account.

## File Structure

```
photo-contest/
├── components/
│   ├── AddPhotoForm.js
│   ├── Calendar.js
│   ├── GameSettings.js
│   ├── GameList.js
│   ├── Home.js
│   ├── LoginForm.js
│   ├── RegisterForm.js
│   ├── SplashScreen.js
│   ├── VoteGrid.js
│   ├── ... // other components as needed
├── lib/
│   ├── mongodb.js
├── models/
│   ├── User.js
│   ├── Photo.js
│   ├── Contest.js
│   ├── Game.js
│   ├── Category.js
│   ├── Theme.js
├── pages/
│   ├── api/
│   │   ├── users.js
│   │   ├── photos.js
│   │   ├── contests.js
│   │   ├── games.js
│   │   ├── categories.js
│   │   ├── themes.js
│   ├── screens/
│   │   ├── splash/
│   │   │   ├── index.js
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   ├── index.js
│   │   │   ├── register/
│   │   │   │   ├── index.js
│   │   ├── home/
│   │   │   ├── index.js
│   │   ├── game/
│   │   │   ├── [id].js
│   │   ├── settings/
│   │   │   ├── index.js
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   ├── ... // other images as needed
├── styles/
│   ├── globals.css
│   ├── ... // other style files as needed
├── .env.local
├── next.config.js
├── package.json
├── README.md
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JohannSako/photo-contest.git
   cd photo-contest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env.local` file** and add your MongoDB URI:
   ```env
   MONGODB_URI=mongodb+srv://{user}:{password}@mongodb-88fba0e3-o44f16270.database.cloud.ovh.net/photo-contest?authMechanism=SCRAM-SHA-256&replicaSet=replicaset&tls=true
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- **Splash Screen**: Wait for the splash screen to disappear and redirect to the login/register page.
- **Login/Register**: Create an account or log in with existing credentials.
- **Home**: View and manage your games, create new games, or access settings.
- **Games**: Participate in contests by uploading photos or voting on submissions.
- **Settings**: Manage your account settings, including logging out or deleting your account.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation.
- **MongoDB**: NoSQL database for storing user, game, and contest data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js.
- **NextAuth.js**: Authentication for Next.js applications.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any enhancements or bug fixes.

## Contact

For any questions or issues, please contact [johann.sako@epitech.eu].