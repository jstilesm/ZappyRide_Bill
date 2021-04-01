export default function FormInput(props) {
  return (
    <>
      {props.label && <label className="labels">{props.label}</label>}
      <input
        className="inputs"
        type={props.type}
        value={props.value}
        step={props.step}
        onChange={props.onChange}
      />
    </>
  );
}
