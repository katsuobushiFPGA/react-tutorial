/*
 
   以下のHTMLをJSXに変換する練習用コンポーネント 
 
 <h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
**/

export default function Todo() {
  const items = [
    { id: 1, content: "Invent new traffic lights" },
    { id: 2, content: "Rehearse a movie scene" },
    { id: 3, content: "Improve the spectrum technology" }
  ];

  const listItems = items.map(item =>
    <li
      key={item.id}
    > {item.content}
    </li>
  );

  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      {listItems}
    </>
  )
}
