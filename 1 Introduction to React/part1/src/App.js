import { useState } from "react";

// const Display = ({ counter }) => {
//   return <div>{counter}</div>;
// };

// const Button = ({ handleClick, text }) => (
//   <button onClick={handleClick}>{text}</button>
// );
// const App = () => {
//   const [counter, setCounter] = useState(0);
//   console.log("rendering with counter value", counter);

//   const increaseByOne = () => {
//     console.log("increasing, value before", counter);
//     setCounter(counter + 1);
//   };

//   const decreaseByOne = () => {
//     console.log("decreasing, value before", counter);
//     setCounter(counter - 1);
//   };

//   const setToZero = () => {
//     setCounter(0);
//     console.log("resetting to zero, value before", counter);
//   };

//   return (
//     <div>
//       <Display counter={counter} />
//       <Button handleClick={increaseByOne} text="plus" />
//       <Button handleClick={setToZero} text="zero" />
//       <Button handleClick={decreaseByOne} text="minus" />
//     </div>
//   );
// };

// const Button = ({ handleClick, text }) => (
//   <button onClick={handleClick}>{text}</button>
// );

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return <div>the app is used by pressing the buttons</div>;
//   }
//   return <div>button press history: {props.allClicks.join(" ")}</div>;
// };

// const App = () => {
//   // const [clicks, setClicks] = useState({ left: 0, right: 0 });
//   const [left, setLeft] = useState(0);
//   const [right, setRight] = useState(0);
//   const [allClicks, setAll] = useState([]);
//   const [total, setTotal] = useState(0);

//   const handleLeftClick = () => {
//     setAll(allClicks.concat("L"));
//     // setClicks({
//     //   ...clicks,
//     //   left: clicks.left + 1,
//     // });
//     const updatedLeft = left + 1;
//     setLeft(updatedLeft);
//     setTotal(updatedLeft + right);
//   };

//   const handleRightClick = () => {
//     setAll(allClicks.concat("R"));
//     // setClicks({
//     //   ...clicks,
//     //   right: clicks.right + 1,
//     // });
//     const updatedRight = right + 1;
//     setRight(updatedRight);
//     setTotal(left + updatedRight);
//   };

//   return (
//     <div>
//       {left}
//       <Button handleClick={handleLeftClick} text="left" />
//       <Button handleClick={handleRightClick} text="right" />
//       {right}
//       <p>{allClicks.join(" ")}</p>
//       <History allClicks={allClicks} />
//     </div>
//   );
// };

const Display = (props) => <div>{props.value}</div>;

const Button = (props) => (
  <button onClick={props.handleClick}>{props.text}</button>
);

const App = () => {
  const [value, setValue] = useState(10);

  const setToValue = (newValue) => {
    console.log("value now", newValue);
    setValue(newValue);
  };

  return (
    <div>
      <Display value={value} />
      <Button handleClick={() => setToValue(1000)} text="thousand" />
      <Button handleClick={() => setToValue(0)} text="reset" />
      <Button handleClick={() => setToValue(value + 1)} text="increment" />
    </div>
  );
};

export default App;
