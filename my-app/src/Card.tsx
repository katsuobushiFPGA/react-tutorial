import Avatar from './Avatar.tsx'

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

export function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
