export default function FormInput(props) {
  return (
    <>
      {props.label && <label className="labels">{props.label}</label>}
      <input
        className="input"
        type={props.type}
        min={props.min}
        max={props.max}
        value={props.value}
        step={props.step}
        onChange={props.onChange}
      />
    </>
  );
}
