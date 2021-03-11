import axios from 'axios';
import React from 'react';

export const ExampleComponent = () => {
  const [pets, setPets] = React.useState<{ id: number; name: string }[]>([]);
  React.useEffect(() => {
    axios.get('/api/pets').then((res) => setPets(res.data));
  }, []);

  if (pets.length === 0) {
    return <>No pets</>;
  }

  return (
    <ul>
      {pets.map((pet) => (
        <li key={pet.id}>{pet.name}</li>
      ))}
    </ul>
  );
};
