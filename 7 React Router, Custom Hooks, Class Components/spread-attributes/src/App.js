import { useState } from "react";

function App() {
  // const [name, setName] = useState("");
  // const [born, setBorn] = useState("");
  // const [height, setHeight] = useState("");
  const useField = (type) => {
    const [value, setValue] = useState("");

    const onChange = (event) => {
      setValue(event.target.value);
    };

    return {
      type,
      value,
      onChange,
    };
  };

  const name = useField("text");
  const born = useField("date");
  const height = useField("number");

  return (
    <div>
      <form>
        name:
        <input {...name} />
        <br />
        birthdate:
        <input {...born} />
        <br />
        height:
        <input {...height} />
      </form>
      <div>
        {name.value} {born.value} {height.value}
      </div>
    </div>
  );
}

export default App;
