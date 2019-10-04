import React from 'react';
import ReactDOM from "react-dom";
import {
  Box,
  Button,
  Heading,
  Text
} from 'rimble-ui';

function App() {
  return (
    <div>
      <Box>
        <Heading>Your Heading</Heading>
        <Text>Some of text of yours here</Text>
        <Button> click me! </Button>
      </Box>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

export default App;
