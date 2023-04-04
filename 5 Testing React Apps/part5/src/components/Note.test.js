import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Note from "./Note";

test("renders content", () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  // Using element
  render(<Note note={note} />);

  // Prints the HTML of a component to the terminal
  // eslint-disable-next-line testing-library/no-debugging-utils
  screen.debug();

  const element = screen.getByText(
    "Component testing is done with react-testing-library"
  );

  // Prints the HTML of an element to the terminal
  // eslint-disable-next-line testing-library/no-debugging-utils
  screen.debug(element);

  expect(element).toBeDefined();

  // Using css selectors
  const { container } = render(<Note note={note} />);

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const div = container.querySelector(".note");
  expect(div).toHaveTextContent(
    "Component testing is done with react-testing-library"
  );
});

test("clicking the button calls event handler once", async () => {
  const note = {
    content: "Component testing is done with react-testing-library",
    important: true,
  };

  const mockHandler = jest.fn();

  render(<Note note={note} toggleImportance={mockHandler} />);

  const user = userEvent.setup();
  const button = screen.getByText("make not important");
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
