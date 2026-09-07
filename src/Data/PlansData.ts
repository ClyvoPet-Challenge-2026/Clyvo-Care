export interface ClyvoPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  popular?: boolean;
  color: string;
  badgeBg: string;
  badgeText: string;
  features: string[];
}

export const ClyvoPlansData: ClyvoPlan[] = [
  {
    id: "essential",
    name: "Clyvo Essencial",
    tagline: "Proteção básica para o dia a dia",
    price: "R$ 49,90",
    period: "/mês",
    popular: false,
    color: "#1F6AE1",
    badgeBg: "bg-soft",
    badgeText: "text-brand",
    features: [
      "Consultas clínicas em horário comercial",
      "Vacinas anuais obrigatórias (V8/V10 ou Quádrupla felina)",
      "Exames laboratoriais básicos (Sangue e Fezes)",
      "Atendimento por telemedicina pet 24h",
      "Rede de parceiros com descontos",
    ],
  },
  {
    id: "comfort",
    name: "Clyvo Conforto",
    tagline: "O equilíbrio perfeito para prevenção e rotina",
    price: "R$ 89,90",
    period: "/mês",
    popular: true,
    color: "#0069e8",
    badgeBg: "bg-brand",
    badgeText: "text-paper",
    features: [
      "Tudo do plano Essencial incluso",
      "Consultas de urgência e emergência 24h",
      "Exames de imagem (Raio-X e Ultrassom)",
      "Procedimentos ambulatoriais e curativos",
      "Limpeza de tártaro preventiva anual",
      "Desconto em banho e tosa conveniados",
    ],
  },
  {
    id: "plus",
    name: "Clyvo Plus",
    tagline: "Cobertura hospitalar e diagnóstica avançada",
    price: "R$ 139,90",
    period: "/mês",
    popular: false,
    color: "#182447",
    badgeBg: "bg-navy",
    badgeText: "text-paper",
    features: [
      "Tudo do plano Conforto incluso",
      "Internação clínica até 5 dias por ano",
      "Cirurgias de tecidos moles e castração",
      "Consultas com especialistas (Cardio, Derma, Ortopedia)",
      "Exames bioquímicos completos e citologia",
      "Atendimento veterinário domiciliar (1x/ano)",
    ],
  },
  {
    id: "premium",
    name: "Clyvo Premium",
    tagline: "Máxima tranquilidade para tratamentos complexos",
    price: "R$ 199,90",
    period: "/mês",
    popular: false,
    color: "#008c4d",
    badgeBg: "bg-ok",
    badgeText: "text-paper",
    features: [
      "Tudo do plano Plus incluso",
      "Internação em UTI sem limite de carência básica",
      "Cirurgias complexas e ortopédicas",
      "Sessões de Fisioterapia e Acupuntura (até 10/ano)",
      "Exames de alta complexidade (Ecocardiograma, Tomografia)",
      "Reembolso para urgências fora da rede credenciada",
    ],
  },
  {
    id: "senior",
    name: "Clyvo Sênior & Especial",
    tagline: "Cuidado dedicado para pets idosos ou com doenças crônicas",
    price: "R$ 239,90",
    period: "/mês",
    popular: false,
    color: "#f6b60b",
    badgeBg: "bg-warn/20",
    badgeText: "text-navy",
    features: [
      "Check-up geriátrico semestral completo",
      "Acompanhamento oncológico e nefrológico",
      "Reabilitação motora e fisioterapia contínua",
      "Suporte nutricional clínico personalizado",
      "Atendimento veterinário em domicílio (3x/ano)",
      "Assistência funeral e suporte ao tutor",
    ],
  },
];
