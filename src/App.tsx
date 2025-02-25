// import { useEffect, useState } from "react";
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { StorageBrowser } from '../components/StorageBrowser';


// const client = generateClient<Schema>();
Amplify.configure(outputs);

function App() {

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);


  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user?.username}</h1>
          <button onClick={signOut}>Sign out</button>
          {/* StorageBrowser Component */}
          <h2>Your Files</h2>
          <StorageBrowser />
        </main>
      )}
    </Authenticator>
  );
};


export default App;
