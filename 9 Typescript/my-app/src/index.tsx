import ReactDOM from "react-dom/client";

interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element => (
  <h1>Hello, {props.name}</h1>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Welcome name="Sarah" />
);
