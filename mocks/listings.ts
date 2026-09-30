import type { Listing, ListingStatus, PriceMode, VehicleCondition } from "@/types/listing";
import { SEED_USERS } from "./users";
import { catalogVehicle, FIPE_REFERENCE_MONTH } from "./vehicleCatalog";

interface SeedSpec {
  id: string;
  vehicle: string;
  sellerId: string;
  plate: string;
  km: number;
  color: string;
  priceMode: PriceMode;
  /** % abaixo da FIPE (negativo = acima). */
  repasseOff?: number;
  finalOff?: number;
  condition?: Partial<VehicleCondition>;
  status?: ListingStatus;
  daysAgo: number;
  views: number;
  manufactureYearOffset?: number;
  description: string;
}

const CLEAN: VehicleCondition = {
  hasAuctionHistory: false,
  hasAccidentHistory: false,
  isFinanced: false,
  hasDebts: false,
  singleOwner: false,
  hasServiceRecords: true,
  hasSpareKey: true,
};

const SPECS: SeedSpec[] = [
  {
    id: "l-onix-21-recife", vehicle: "onix", sellerId: "00000000-0000-4000-8000-000000000101", plate: "PCZ4H21", km: 48000, color: "Prata",
    priceMode: "ambos", repasseOff: 18, finalOff: 6, daysAgo: 1, views: 312,
    condition: { singleOwner: true },
    description: "Onix 1.0 manual muito conservado, único dono, todas as revisões na concessionária (manual e nota). Pneus com uns 60% de vida. Tem um risco pequeno no para-choque traseiro, fora isso tudo certo. Preço de repasse para quem leva no estado; no preço final vai revisado e com garantia de motor e câmbio de 3 meses.",
  },
  {
    id: "l-hb20-20-fortaleza", vehicle: "hb20", sellerId: "00000000-0000-4000-8000-000000000102", plate: "OSK7B42", km: 52000, color: "Branco",
    priceMode: "repasse", repasseOff: 15, daysAgo: 2, views: 198,
    description: "HB20 Diamond turbo automático, o top de linha. Central multimídia com CarPlay, câmera de ré, rodas 16. Para-brisa trincado no canto do passageiro (já está no preço). Revisões em dia até 50 mil. Repasse para lojista, sem enrolação, documento pronto para transferir.",
  },
  {
    id: "l-gol-18-salvador", vehicle: "gol", sellerId: "00000000-0000-4000-8000-000000000104", plate: "JQX2E18", km: 98000, color: "Branco",
    priceMode: "repasse", repasseOff: 22, daysAgo: 0, views: 87,
    condition: { hasAuctionHistory: true, hasServiceRecords: false },
    description: "Gol Track 1.0, carro de leilão (recuperado de financiamento, sem batida). Motor bom, sem fumaça, embreagem já pedindo troca. Lataria com marcas de uso. Ideal para quem tem oficina ou quer rodar Uber. Leilão informado desde já, sem surpresa na hora da vistoria.",
  },
  {
    id: "l-strada-22-recife", vehicle: "strada", sellerId: "00000000-0000-4000-8000-000000000101", plate: "QYB8C33", km: 58000, color: "Vermelho",
    priceMode: "final", finalOff: -2, daysAgo: 3, views: 421,
    condition: { singleOwner: true },
    description: "Strada Freedom cabine dupla, pronta para trabalho ou passeio. Capota marítima, protetor de caçamba, engate. Revisada na loja: óleo, filtros, pastilhas e alinhamento feitos. Aceitamos troca e financiamos. Garantia de 90 dias em motor e câmbio.",
  },
  {
    id: "l-compass-19-campinas", vehicle: "compass", sellerId: "00000000-0000-4000-8000-000000000103", plate: "FXT3A19", km: 87000, color: "Preto",
    priceMode: "ambos", repasseOff: 12, finalOff: 4, daysAgo: 5, views: 276,
    description: "Compass Longitude 2.0 flex automático. Bancos em couro, teto solar, multimídia original. Pneus trocados há 5 mil km. Tem pequenos amassados de estacionamento na porta traseira direita. No repasse vai do jeito que está; no preço final entregamos com martelinho feito e polimento.",
  },
  {
    id: "l-corolla-20-bh", vehicle: "corolla", sellerId: "00000000-0000-4000-8000-000000000105", plate: "QPH6D20", km: 71000, color: "Prata",
    priceMode: "final", finalOff: 5, daysAgo: 4, views: 350,
    condition: { singleOwner: true },
    description: "Corolla XEi 2020 de médico, rodou quase só estrada. Revisões todas na Toyota com carimbo no manual. Interior impecável, sem cheiro de cigarro. Estou intermediando a venda, o dono aceita vistoria cautelar por conta do comprador em qualquer empresa.",
  },
  {
    id: "l-civic-18-jp", vehicle: "civic", sellerId: "00000000-0000-4000-8000-000000000106", plate: "QFJ1G18", km: 102000, color: "Preto",
    priceMode: "final", finalOff: 3, status: "vendido", daysAgo: 21, views: 505,
    description: "Vendo meu Civic EXL 2018, carro de família. Troquei a correia e fiz a revisão dos 100 mil agora. Tem um arranhado no para-choque dianteiro e o banco do motorista com desgaste na lateral. Documento em dia, IPVA 2026 pago. Só venda, não pego troca.",
  },
  {
    id: "l-kwid-21-natal", vehicle: "kwid", sellerId: "00000000-0000-4000-8000-000000000107", plate: "RGA5J21", km: 39000, color: "Branco",
    priceMode: "final", finalOff: 8, daysAgo: 6, views: 164,
    condition: { singleOwner: true, hasSpareKey: false },
    description: "Kwid Intense 2021, sou a única dona e usei só para ir ao trabalho. Econômico demais, faz 14 km/l na cidade. Perdi a chave reserva, por isso o preço um pouco abaixo. Revisões feitas na Renault até 30 mil. Pode vir ver em Natal a qualquer hora.",
  },
  {
    id: "l-tcross-23-fortaleza", vehicle: "t-cross", sellerId: "00000000-0000-4000-8000-000000000102", plate: "SAB9F23", km: 23000, color: "Cinza",
    priceMode: "repasse", repasseOff: 9, daysAgo: 1, views: 230,
    condition: { singleOwner: true },
    description: "T-Cross 200 TSI 2023 com 23 mil km, ainda na garantia de fábrica. Carro de repasse de cliente que trocou por um maior. Sem detalhes de lataria, pneus originais. Preço de repasse para girar rápido, documento no nome da loja.",
  },
  {
    id: "l-hilux-19-salvador", vehicle: "hilux", sellerId: "00000000-0000-4000-8000-000000000104", plate: "OUV4K19", km: 138000, color: "Prata",
    priceMode: "repasse", repasseOff: 14, daysAgo: 8, views: 610,
    condition: { isFinanced: true },
    description: "Hilux SRV 2.8 diesel 4x4, rodou em fazenda mas sempre com manutenção em dia (notas das revisões). Está alienada ao banco, o saldo é quitado no ato da venda com o dinheiro do comprador, tudo dentro do banco. Pneus BF novos. Motor forte, sem vazamento.",
  },
  {
    id: "l-renegade-18-recife", vehicle: "renegade", sellerId: "00000000-0000-4000-8000-000000000101", plate: "PGE2L18", km: 94000, color: "Vermelho",
    priceMode: "repasse", repasseOff: 25, daysAgo: 2, views: 489,
    condition: { hasAccidentHistory: true, hasServiceRecords: false },
    description: "Renegade 1.8 automático com sinistro: batida de frente com acionamento de airbag, já reparado (airbags trocados, longarina sem dano segundo o laudo). Laudo cautelar disponível, reprovado por causa do sinistro. Por isso 25% abaixo da FIPE. Só para quem sabe o que está comprando.",
  },
  {
    id: "l-argo-20-bh", vehicle: "argo", sellerId: "00000000-0000-4000-8000-000000000105", plate: "PXA7M20", km: 61000, color: "Vermelho",
    priceMode: "ambos", repasseOff: 13, finalOff: 5, daysAgo: 10, views: 143,
    description: "Argo 1.0 Firefly, motor 3 cilindros bem econômico. Ar, direção elétrica, vidros e travas. Um amassadinho na tampa do porta-malas. No repasse sai como está; no preço final o dono entrega com a funilaria feita e revisão de 60 mil paga.",
  },
  {
    id: "l-polo-22-campinas", vehicle: "polo", sellerId: "00000000-0000-4000-8000-000000000103", plate: "GCD5N22", km: 34000, color: "Azul",
    priceMode: "final", finalOff: 4, daysAgo: 12, views: 190,
    condition: { singleOwner: true },
    description: "Polo 200 TSI Comfortline 2022 azul, lindo. Painel digital, multimídia, sensor de estacionamento. Revisões na VW até 30 mil. Aceitamos seu carro na troca e financiamos em até 60x. Garantia da loja de 6 meses em motor e câmbio.",
  },
  {
    id: "l-onix-14-goiania", vehicle: "onix-2014", sellerId: "00000000-0000-4000-8000-000000000108", plate: "NKO3P14", km: 142000, color: "Preto",
    priceMode: "repasse", repasseOff: 17, daysAgo: 3, views: 98,
    condition: { hasDebts: true, hasServiceRecords: false },
    description: "Onix LT 1.4 2014, carro de uso diário. Tem IPVA 2026 atrasado e duas multas (uns R$ 1.900 no total), dá para descontar do valor ou eu pago na transferência. Mecânica boa, suspensão fazendo um barulhinho na frente. Aceito proposta à vista.",
  },
  {
    id: "l-creta-21-fortaleza", vehicle: "creta", sellerId: "00000000-0000-4000-8000-000000000102", plate: "POH8Q21", km: 66000, color: "Prata",
    priceMode: "repasse", repasseOff: 11, daysAgo: 6, views: 175,
    description: "Creta 1.6 Action automático 2021. Carro de repasse de cliente, sem retoque de pintura. Multimídia com espelhamento, câmera de ré. Pneus dianteiros novos. Documentação ok para transferir na hora. Repasse para lojista ou corretor.",
  },
  {
    id: "l-toro-20-salvador", vehicle: "toro", sellerId: "00000000-0000-4000-8000-000000000104", plate: "PKR1R20", km: 112000, color: "Branco",
    priceMode: "ambos", repasseOff: 10, finalOff: 3, daysAgo: 9, views: 340,
    description: "Toro Endurance 2.0 diesel 4x4 automática. Usada em obra, caçamba com marcas de uso e protetor. Motor e câmbio perfeitos, troca de óleo a cada 10 mil com nota. Repasse no estado; no preço final vai com caçamba repintada e revisão completa.",
  },
  {
    id: "l-hb20-24-jp", vehicle: "hb20-2024", sellerId: "00000000-0000-4000-8000-000000000106", plate: "RLB6S24", km: 12000, color: "Branco",
    priceMode: "final", finalOff: -3, daysAgo: 2, views: 120,
    condition: { singleOwner: true },
    description: "HB20 Comfort 2024 com só 12 mil km, praticamente zero. Ainda tem 4 anos de garantia de fábrica. Estou vendendo porque vou mudar de cidade. Tem película, tapetes e alarme. Preço um pouco acima da FIPE por causa do km baixíssimo, mas aceito conversar.",
  },
  {
    id: "l-tracker-23-recife", vehicle: "tracker", sellerId: "00000000-0000-4000-8000-000000000101", plate: "RYC4T23", km: 19000, color: "Cinza",
    priceMode: "repasse", repasseOff: 7, daysAgo: 0, views: 58,
    condition: { singleOwner: true },
    description: "Tracker 1.0 turbo automático 2023, 19 mil km, garantia GM. Chegou hoje na loja, ainda vai para a vitrine. Sem nenhum detalhe. Repasse com preço de ocasião para quem fechar primeiro.",
  },
  {
    id: "l-virtus-21-campinas", vehicle: "virtus", sellerId: "00000000-0000-4000-8000-000000000103", plate: "FQZ8U21", km: 57000, color: "Prata",
    priceMode: "final", finalOff: 6, daysAgo: 14, views: 211,
    description: "Virtus 200 TSI Comfortline automático. Porta-malas enorme, ideal para família ou aplicativo premium. Revisado na loja, pneus meia vida. Pequeno arranhão no retrovisor esquerdo. Financiamento com entrada a partir de 20%.",
  },
  {
    id: "l-gol-12-natal", vehicle: "gol-2012", sellerId: "00000000-0000-4000-8000-000000000107", plate: "MYH2V12", km: 168000, color: "Prata",
    priceMode: "repasse", repasseOff: 20, daysAgo: 16, views: 77,
    condition: { hasAuctionHistory: true, hasServiceRecords: false, hasSpareKey: false },
    description: "Gol 1.6 Power 2012, comprei já com passagem por leilão (consta no documento). Motor 1.6 forte, ar gelando. Tem ferrugem no pé da porta traseira e o banco de trás rasgado. Carro honesto para o dia a dia, preço baixo justamente pelo leilão.",
  },
  {
    id: "l-mobi-19-goiania", vehicle: "mobi", sellerId: "00000000-0000-4000-8000-000000000108", plate: "PQS5W19", km: 73000, color: "Branco",
    priceMode: "repasse", repasseOff: 16, status: "pausado", daysAgo: 25, views: 66,
    description: "Mobi Drive 1.0 2019, carro de entrada muito econômico. Ar, direção, vidros elétricos na frente. Pneus trocados ano passado. Um amassado pequeno no para-lama. Pausei o anúncio enquanto resolvo a transferência de um débito antigo.",
  },
  {
    id: "l-ccross-22-bh", vehicle: "corolla-cross", sellerId: "00000000-0000-4000-8000-000000000105", plate: "RFN3X22", km: 44000, color: "Cinza",
    priceMode: "final", finalOff: 2, daysAgo: 7, views: 402,
    condition: { singleOwner: true },
    description: "Corolla Cross XRE 2022, cliente meu trocou por um híbrido. Todas as revisões na Toyota, pneus Bridgestone originais com 60%. Sem batida, sem retoque. Aceita vistoria cautelar e financiamento. Carro para quem quer SUV sem dor de cabeça.",
  },
  {
    id: "l-yaris-21-fortaleza", vehicle: "yaris", sellerId: "00000000-0000-4000-8000-000000000102", plate: "OSP7Y21", km: 49000, color: "Vermelho",
    priceMode: "ambos", repasseOff: 9, finalOff: 2, daysAgo: 11, views: 133,
    description: "Yaris S 1.5 automático CVT, câmbio suave e motor confiável. Chave presencial, partida no botão. Repasse para loja no estado atual (precisa de higienização interna); preço final com higienização, polimento e revisão de 50 mil.",
  },
  {
    id: "l-s10-18-salvador", vehicle: "s10", sellerId: "00000000-0000-4000-8000-000000000104", plate: "OZE9Z18", km: 156000, color: "Preto",
    priceMode: "repasse", repasseOff: 13, daysAgo: 18, views: 288,
    description: "S10 100 Years 2.8 diesel 4x4 automática, edição especial. Km alto mas de estrada, manutenção em concessionária até 120 mil e depois em oficina especializada (notas guardadas). Turbina revisada há 10 mil km. Preço de repasse, não faço garantia.",
  },
  {
    id: "l-hrv-19-campinas", vehicle: "hr-v", sellerId: "00000000-0000-4000-8000-000000000103", plate: "FYJ2A19", km: 81000, color: "Prata",
    priceMode: "final", finalOff: 5, status: "vendido", daysAgo: 30, views: 377,
    description: "HR-V EX 1.8 automático, bancos em couro, multimídia, câmera de ré. Revisões na Honda. Vendido para um cliente de Sumaré, mas deixo o anúncio para quem quiser ver o padrão dos nossos carros.",
  },
  {
    id: "l-duster-18-recife", vehicle: "duster", sellerId: "00000000-0000-4000-8000-000000000101", plate: "PFD6B18", km: 104000, color: "Cinza",
    priceMode: "repasse", repasseOff: 19, daysAgo: 13, views: 156,
    description: "Duster 1.6 automático CVT 2018. Câmbio já revisado (troca de fluido feita). Lataria com riscos de uso e para-choque traseiro com pintura queimada. Mecânica em ordem. Repasse para lojista ou quem quer um SUV barato para o dia a dia.",
  },
  {
    id: "l-kicks-20-jp", vehicle: "kicks", sellerId: "00000000-0000-4000-8000-000000000106", plate: "QFR4C20", km: 58000, color: "Prata",
    priceMode: "final", finalOff: 4, daysAgo: 4, views: 142,
    condition: { singleOwner: true },
    description: "Kicks S 1.6 automático 2020, sou o primeiro dono. Uso para trabalho em João Pessoa, nunca pegou estrada de terra. Revisões feitas na Nissan até 50 mil. Um amassado leve na porta do motorista. Pode trazer seu mecânico ou fazer cautelar.",
  },
  {
    id: "l-cronos-23-bh", vehicle: "cronos", sellerId: "00000000-0000-4000-8000-000000000105", plate: "RHT8D23", km: 21000, color: "Prata",
    priceMode: "final", finalOff: 1, daysAgo: 20, views: 95,
    condition: { singleOwner: true },
    description: "Cronos Drive 1.3 2023, sedã econômico com porta-malas de 525 litros. Ainda na garantia Fiat. Carro de professora, só cidade. Preço praticamente na FIPE porque está como novo. Estou intermediando, atendo em BH e região.",
  },
  {
    id: "l-onixplus-22-fortaleza", vehicle: "onix-plus", sellerId: "00000000-0000-4000-8000-000000000102", plate: "SAD1E22", km: 41000, color: "Branco",
    priceMode: "repasse", repasseOff: 12, status: "pausado", daysAgo: 27, views: 201,
    description: "Onix Plus 1.0 turbo automático, ex-aplicativo com manutenção rigorosa (todas as notas). Bancos com capa desde o primeiro dia. Pausado enquanto passa por polimento, volta em breve com fotos novas.",
  },
  {
    id: "l-strada-22-goiania", vehicle: "strada", sellerId: "00000000-0000-4000-8000-000000000108", plate: "PQX6F22", km: 88000, color: "Branco",
    priceMode: "final", finalOff: 7, daysAgo: 5, views: 187,
    description: "Strada Freedom CD 2022 branca. Uso em fazenda aqui perto de Goiânia, mas sem judiar: óleo trocado certinho, pneus All Terrain seminovos. Caçamba com riscos. Estou vendendo para comprar uma diesel. Documento em dia.",
  },
];

const DAY = 24 * 60 * 60 * 1000;

/** Foto de demonstração do modelo (Wikimedia Commons; créditos em mocks/photoCredits.ts). */
export function demoPhoto(vehicleKey: string): string {
  return `/demo/${vehicleKey}.jpg`;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

function priceWithOffset(fipePrice: number, offPercent: number): number {
  return roundTo(fipePrice * (1 - offPercent / 100), 100);
}

/** Gera os anúncios de demonstração com datas relativas a "agora". */
export function createSeedListings(now: Date = new Date()): Listing[] {
  return SPECS.map((spec) => {
    const vehicle = catalogVehicle(spec.vehicle);
    const seller = SEED_USERS.find((user) => user.id === spec.sellerId);
    if (!seller) throw new Error(`Vendedor ${spec.sellerId} não existe no seed.`);

    const createdAt = new Date(now.getTime() - spec.daysAgo * DAY - (spec.views % 12) * 60 * 60 * 1000);

    return {
      id: spec.id,
      sellerId: seller.id,
      plate: spec.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      version: vehicle.version,
      modelYear: vehicle.modelYear,
      manufactureYear: vehicle.modelYear - (spec.manufactureYearOffset ?? (spec.km % 2 === 0 ? 1 : 0)),
      fuel: vehicle.fuel,
      transmission: vehicle.transmission,
      bodyType: vehicle.bodyType,
      km: spec.km,
      color: spec.color,
      city: seller.city,
      state: seller.state,
      fipeCode: vehicle.fipeCode,
      fipePrice: vehicle.fipePrice,
      fipeReferenceMonth: FIPE_REFERENCE_MONTH,
      priceMode: spec.priceMode,
      repassePrice:
        spec.repasseOff !== undefined ? priceWithOffset(vehicle.fipePrice, spec.repasseOff) : undefined,
      finalPrice:
        spec.finalOff !== undefined ? priceWithOffset(vehicle.fipePrice, spec.finalOff) : undefined,
      description: spec.description,
      condition: { ...CLEAN, ...spec.condition },
      photos: [demoPhoto(spec.vehicle)],
      status: spec.status ?? "ativo",
      views: spec.views,
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      confirmedAt: createdAt.toISOString(),
    };
  });
}
