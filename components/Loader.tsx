// import React from 'react';
// import { ClipLoader } from 'react-spinners';
// import { CSSProperties } from 'react';  // Import CSSProperties from react

// const Loader = () => {
//   return (
//     <div style={styles.loaderContainer as CSSProperties}>
//       <ClipLoader color="#3498db" size={50} />
//       <span style={styles.loadingText}>Loading...</span>
//     </div>
//   );
// };

// const styles = {
//   loaderContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: '100vh',
//   },
//   loadingText: {
//     marginTop: '20px', // Add some space between the spinner and the text
//     color: '#3498db',
//     fontSize: '18px',
//     fontWeight: 'bold',  // Make the text bold
//   },
// };

// export default Loader;

// import React from 'react';
import { CSSProperties } from "react";
import ClipLoader from "react-spinners/PacmanLoader";
// import type { Property } from 'csstype'

// import * as CSS from 'csstype';

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#3498db",
};

const Loader = ({ color = "#030303", size = 60 }) => {
  return (
    <div style={styles.loaderContainer as CSSProperties }>
      <ClipLoader
        color={color}
        loading={true}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span style={styles.loadingText}>Loading...</span>
    </div>
  );
};

const styles = {
  loaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  loadingText: {
    marginTop: '20px', // Add some space between the spinner and the text
    color: '#030303',
    fontSize: '18px',
    fontWeight: 'bold',  // Make the text bold
  },
};

export default Loader;