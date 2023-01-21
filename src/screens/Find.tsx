import { useState } from "react";
import { VStack, Heading, useToast } from "native-base";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

const Find = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const toast = useToast();

  const { navigate } = useNavigation();

  const handleJoinPool = async () => {
    try {
      if (!code.trim()) {
        return toast.show({
          title: 'Por favor, informe o código',
          placement: "top",
          bgColor: "red.500",
        });
      }
      setIsLoading(true);
      await api.post('/pools/join', { code });

      toast.show({
        title: 'Você entrou no bolão com sucesso',
        placement: "top",
        bgColor: "green.500",
      });

      navigate('pools');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      if (error.response?.data?.message) {
        return toast.show({
          title: error.response.data.message,
          placement: "top",
          bgColor: "red.500",
        });
      }
    }
  };
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          onChangeText={setCode}
          autoCapitalize="characters"
          value={code}
        />
        <Button
          title="buscar bolão"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
};

export default Find;
