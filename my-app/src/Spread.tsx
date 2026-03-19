function Avatar({ person, size, isSepia, thickBorder }) {
  return (
    <div>
      <p>name={person.name}</p>
      <p>size={size}</p>
      <p>isSepia={isSepia}</p>
      <p>thickBorder={thickBorder}</p>
    </div>
  );
}

export default function Spread(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
