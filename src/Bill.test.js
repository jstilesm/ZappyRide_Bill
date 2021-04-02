import { render, screen } from "@testing-library/react";
import Bill from "./Bill";

test("renders learn react link", () => {
  render(<Bill />);
  const linkElement = screen.getByText(/Loading/i);
  expect(linkElement).toBeInTheDocument();
});
