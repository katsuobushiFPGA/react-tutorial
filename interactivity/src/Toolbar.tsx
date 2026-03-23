export function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={() => onPlayMovie("aaa")}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
