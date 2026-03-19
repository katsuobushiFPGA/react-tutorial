import { useState } from 'react'
import { Gallery } from './Profile'
import TextBox from './TextBox'
import Todo from './HtmlToJsx'
import Avatar, { TodoList } from './Braces'
import ProfileA from './Props'
import Spread from './Spread'
import { Profile as ProfileB } from './Card'

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
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <List />
      {content}
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
      <Gallery />
      <TextBox />
      <Todo />
      <Avatar />
      <TodoList />
      <ProfileA />
      <Spread
        person={{ name: 'hiroto' }}
        size={100}
        isSepia={false}
        thickBorder={'test'}
      />
      <ProfileB />
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

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
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

