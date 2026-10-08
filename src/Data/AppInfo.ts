import Constants from "expo-constants";

const buildInfo = Constants.expoConfig?.extra?.appInfo;

export const appInfo = {
  name: "Clyvo Care",
  version: Constants.expoConfig?.version ?? "Não informada",
  commitHash: typeof buildInfo?.commitHash === "string" ? buildInfo.commitHash : null,
  hasLocalChanges: typeof buildInfo?.hasLocalChanges === "boolean"
    ? buildInfo.hasLocalChanges
    : null,
  purpose: "O Clyvo Care é o portal do tutor no ecossistema Clyvo Vet. Nossa proposta é reunir informações dos pets, planos de saúde e cuidados veterinários em um só lugar, facilitando o acompanhamento da saúde e o cuidado preventivo.",
  team: [
    { name: "André Emygdio Ferreira", rm: "565592", avatarUrl: "https://avatars.githubusercontent.com/u/157508293?s=130&v=4" },
    { name: "Gabriel Lourenço Martins", rm: "562194", avatarUrl: "https://avatars.githubusercontent.com/u/202126486?v=4" },
    { name: "Giovane Amato dos Santos", rm: "561336", avatarUrl: "https://avatars.githubusercontent.com/u/200883157?v=4&size=64" },
    { name: "Matheus Roque Arantes", rm: "561959", avatarUrl: "https://avatars.githubusercontent.com/u/202198493?s=130&v=4" },
    { name: "Orlando Gonçalves de Arruda", rm: "561584", avatarUrl: "https://avatars.githubusercontent.com/u/200932226?s=130&v=4" },
  ],
};
