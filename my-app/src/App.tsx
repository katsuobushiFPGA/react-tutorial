let content;

if (true) {
  content = <Profile />;
} else {
  content = <MyButton />;
}

const products = [
  { title: 'Yellow', color: 'yellow', id: 1 },
  { title: 'Purple', color: 'purple', id: 2 },
  { title: 'Blue', color: 'blue', id: 3 },
];

export default function App() {
  return (
    <div>
      <List />
      {content}
      <MyButton />
    </div>
  )
}


function List() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.color
      }}
    >
      {product.title}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  )
}

const user = {
  name: 'Horiba Hiroto',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  )
}


function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}

function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}

