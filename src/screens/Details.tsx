import { useState, useEffect } from "react";
import { VStack, useToast, HStack, Text, Box, Button as NativeButton } from "native-base";
import { Pressable, Share } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { api } from "../services/api";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Button } from "../components/Button";

interface RouteParams {
  id: string;
}

const Details = () => {
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState<string>("A");
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const route = useRoute();
  const { id } = route.params as RouteParams;

  const toast = useToast();

  const fetchPoolDetails = async () => {
    console.log('fetchPoolDetails');
    try {
      // setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      console.log('res =>', response.data);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeShare = async () => {
    await Share.share({
      message: poolDetails.code,
    });
  };

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) return <Loading />;

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        onShare={handleCodeShare}
        showBackButton
        showShareButton
      />
      {poolDetails._count?.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor={"gray.800"} p={1} rounded="sm" mb={1}>
            <Option
              title="Seus palpites"
              onPress={() => setOptionSelected("guesses")}
              isSelected={optionSelected === "guesses"}
            />
            <Option
              title="Ranking do grupo"
              onPress={() => setOptionSelected("ranking")}
              isSelected={optionSelected === "ranking"}
            />
          </HStack>
          <HStack pb={1} overflow="auto">
            <Box flexDirection={"row"} alignItems="center" w="3/6">
              <Text fontSize={"sm"} color="white">
                Grupo atual:{" "}
              </Text>
              <Text fontSize={"sm"} color="white" fontWeight={"bold"}>
                {group}
              </Text>
            </Box>
            {/* <NativeButton.Group isAttached>
              <NativeButton>A</NativeButton>
              <NativeButton>B</NativeButton>
              <NativeButton>C</NativeButton>
              <NativeButton>D</NativeButton>
              <NativeButton>E</NativeButton>
              <NativeButton>F</NativeButton>
              <NativeButton>G</NativeButton>
              <NativeButton>H</NativeButton>
            </NativeButton.Group> */}
          </HStack>
          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
};

export default Details;
