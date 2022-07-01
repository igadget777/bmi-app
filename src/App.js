import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import NavBar from './components/NavBar'
import BMI from './components/BMI'
import './App.css';

function App({ signOut, user }) {

  console.log(user)

  return (
    <div className="App">
      {user ? (
        <>
          <NavBar signOut={signOut} user={user} />
          <BMI user={user} />
        </>
      ) : null}
    </div >
  );
}

export default withAuthenticator(App);
