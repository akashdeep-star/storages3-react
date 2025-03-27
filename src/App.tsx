// import { useEffect, useState } from "react";
// import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import { StorageBrowser } from '../components/StorageBrowser';
import { getCurrentUser ,signInWithRedirect, signOut } from 'aws-amplify/auth';
import { useState, useEffect } from "react";

// const client = generateClient<Schema>();
Amplify.configure(outputs);

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {const { username, userId, signInDetails } = await getCurrentUser();
      console.log(`The username: ${username}`);
      console.log(`The userId: ${userId}`);
      console.log(`The signInDetails: ${signInDetails}`);
      setIsAuthenticated(true)
    }
    catch (err) {
      await signInWithRedirect({
      provider: {
        custom: 'IAMIdC'
      }
    });
    }
    }
  
    fetchAuthStatus()
  
   }, [])

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  // return (
  //   // <Authenticator>
  //     // {({ signOut, user }) => (
  //       <main>
  //         {/* <h1>Hello {user?.username}</h1>
  //         <button onClick={signOut}>Sign out</button> */}
  //         {/* StorageBrowser Component */}
  //         <h2>Your Files</h2>
  //         <StorageBrowser />
  //       </main>
  //     // )}
  //   // </Authenticator>
  // );
  const logout = async () => {
    await signOut();
  }
  if (isAuthenticated) {
    return (
      <main>
        {/* <h1>Hello {user?.username}</h1>*/}
          <button onClick={logout}>Sign out</button> 
        {/* StorageBrowser Component */}
        <h2>Your Files</h2>
        <StorageBrowser />
      </main>
    );
  }
  return <p>loading..</p>;


};


export default App;
