import { useEffect, useRef } from 'react';

export function Modal() {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog ref={dialogRef}>
      <p>モーダルの内容</p>
    </dialog>
  );
}

export default function App() {
  return <Modal />;
}
