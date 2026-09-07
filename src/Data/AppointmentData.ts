import { AppointmentReason, QuickDate } from "../Types/types";

// Tipos de Consulta
export const APPOINTMENT_REASONS: AppointmentReason[] = [
  {
    id: "checkup",
    title: "Check-up Geral",
    description: "Avaliação preventiva, peso e sinais vitais",
    badge: "Rotina",
  },
  {
    id: "vaccine",
    title: "Vacinação",
    description: "Aplicação e atualização da carteirinha de vacinas",
    badge: "Prevenção",
  },
  {
    id: "emergency",
    title: "Urgência / Sintomas",
    description: "Vômito, indisposição, dor ou comportamento atípico",
    badge: "Prioridade",
  },
  {
    id: "specialist",
    title: "Especialidades",
    description: "Dermatologia, oftalmologia, ortopedia ou cardiologia",
    badge: "Especialista",
  },
  {
    id: "dental",
    title: "Odontologia",
    description: "Limpeza de tártaro, avaliação bucal e gengiva",
    badge: "Saúde Bucal",
  },
  {
    id: "return",
    title: "Retorno",
    description: "Reavaliação de tratamento ou pós-cirúrgico",
    badge: "Acompanhamento",
  },
];

// Horários disponíveis
export const AVAILABLE_TIMES: string[] = [
  "08:30",
  "09:15",
  "10:00",
  "11:30",
  "14:00",
  "15:30",
  "16:45",
  "17:30",
];

// Dias rápidos pré-definidos (visuais)
export const QUICK_DATES: QuickDate[] = [
  { label: "Hoje", sublabel: "10/05" },
  { label: "Amanhã", sublabel: "11/05" },
  { label: "Quarta", sublabel: "12/05" },
  { label: "Quinta", sublabel: "13/05" },
];
