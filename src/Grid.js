import "./grid.css";

const GridRow = ({ children }) => <div className="grid__row">{children}</div>;

const GridColumn = ({ children }) => (
  <div className="grid__column">{children}</div>
);
const Grid = ({ children }) => <div className="grid">{children}</div>;

Grid.Row = GridRow;
Grid.Column = GridColumn;

export default Grid;
