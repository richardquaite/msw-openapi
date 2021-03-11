import axios from 'axios';
import React from 'react';

export const ExampleComponent = () => {
  const [loading, setLoading] = React.useState(false);
  const [pets, setPets] = React.useState<{ id: number; name: string }[]>([]);
  React.useEffect(() => {
    setLoading(true);
    axios.get('/api/pets').then((res) => {
      setLoading(false);
      setPets(res.data);
    });
  }, []);

  if (loading) {
    return <>Loading</>;
  }

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
