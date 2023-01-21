import { useState, useEffect } from 'react';
import { useToast, FlatList } from 'native-base';
import { api } from '../services/api';

import { Game, GameProps } from '../components/Game';
import { Loading } from './Loading';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState<string>("A");
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamGoals, setFirstTeamGoals] = useState('');
  const [secondTeamGoals, setSecondTeamGoals] = useState('');
  const toast = useToast();

  const fetchGames = async () => {
    console.log('fetchGames function');
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games/${group}`);
      setGames(response.data.games);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os jogos",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGuessConfirm = async (gameId: string) => {
    try {
      if (!firstTeamGoals.trim() || !secondTeamGoals.trim()) {
        return toast.show({
          title: "Inform o palpite para os dois times",
          placement: "top",
          bgColor: "red.500",
        });
      }
      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamGoals: Number(firstTeamGoals),
        secondTeamGoals: Number(secondTeamGoals),
      });

      toast.show({
        title: "Palpite realizado com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi enviar o palpite",
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  if (isLoading) return <Loading />;

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamGoals}
          setSecondTeamPoints={setSecondTeamGoals}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 16 }}
      ListEmptyComponent={<EmptyMyPoolList code={code} />}
    />
  );
}
