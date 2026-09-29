// Fotos dos anúncios de demonstração, do Wikimedia Commons. As licenças
// CC BY / CC BY-SA exigem citar autor e licença: a lista aparece em /creditos.
// As fotos foram redimensionadas e recomprimidas; a do topo da home também foi escurecida.

export interface PhotoCredit {
  file: string;
  subject: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const PHOTO_CREDITS: PhotoCredit[] = [
  { file: "/demo/onix.jpg", subject: "Chevrolet Onix", author: "RL GNZLZ", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:2022_Chevrolet_Onix_Turbo_LTZ_(Chile)_front_view_(cropped).jpg" },
  { file: "/demo/onix-plus.jpg", subject: "Chevrolet Onix Plus", author: "Just a Man", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:2021_Chevrolet_Onix_Plus_1.2_LT.jpg" },
  { file: "/demo/tracker.jpg", subject: "Chevrolet Tracker", author: "RL GNZLZ from Chile", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Chevrolet_Tracker_1.2_Turbo_LS_2021_(52664171578).jpg" },
  { file: "/demo/s10.jpg", subject: "Chevrolet S10", author: "Ezarate", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:ChevroletS10-Carilo-06280.jpg" },
  { file: "/demo/onix-2014.jpg", subject: "Chevrolet Onix (2014)", author: "RL GNZLZ from Chile", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Chevrolet_Onix_1.4_LT_2014_(34940242872).jpg" },
  { file: "/demo/hb20.jpg", subject: "Hyundai HB20", author: "Just a Man", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:2025_Hyundai_HB20_1.6_Comfort_Plus.jpg" },
  { file: "/demo/hb20-2024.jpg", subject: "Hyundai HB20 (2024)", author: "Autosdeprimera", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", source: "https://commons.wikimedia.org/wiki/File:2023_Hyundai_HB20_1.0_T-GDi_Platinum_Plus_(Brazil)_front_view.png" },
  { file: "/demo/creta.jpg", subject: "Hyundai Creta", author: "Dairokkan9", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2021_Hyundai_Creta_SX(O)_CRDi_(India)_front_view.jpg" },
  { file: "/demo/gol.jpg", subject: "Volkswagen Gol", author: "RL GNZLZ", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Volkswagen_Gol_1.6_MSi_Comfortline_2017.jpg" },
  { file: "/demo/gol-2012.jpg", subject: "Volkswagen Gol (2012)", author: "Passarinho", license: "Public domain", licenseUrl: "", source: "https://commons.wikimedia.org/wiki/File:VW_Gol_2009_front.jpg" },
  { file: "/demo/polo.jpg", subject: "Volkswagen Polo", author: "Vauxford", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2018_Volkswagen_Polo_SE_1.0_Front.jpg" },
  { file: "/demo/t-cross.jpg", subject: "Volkswagen T-Cross", author: "Alexander Migl", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Volkswagen_T-Cross_1X7A0363.jpg" },
  { file: "/demo/virtus.jpg", subject: "Volkswagen Virtus", author: "Just a Man", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:2018_Volkswagen_Virtus_1.6_MSi_Highline_AT.jpg" },
  { file: "/demo/strada.jpg", subject: "Fiat Strada", author: "NaBUru38", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Fiat_Strada_2020_Volcano_in_Montevideo_(front).jpg" },
  { file: "/demo/argo.jpg", subject: "Fiat Argo", author: "NaBUru38", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Fiat_Argo_2020_Trekking_in_Uruguay_(front).jpg" },
  { file: "/demo/toro.jpg", subject: "Fiat Toro", author: "Maxi-Napo-99", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:2019_Fiat_Toro_2.0_Volcano_4x4.jpg" },
  { file: "/demo/mobi.jpg", subject: "Fiat Mobi", author: "RL GNZLZ", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Fiat_Mobi_1.0_Like_2021.jpg" },
  { file: "/demo/cronos.jpg", subject: "Fiat Cronos", author: "Raf24~commonswiki", license: "CC BY 4.0", licenseUrl: "https://creativecommons.org/licenses/by/4.0", source: "https://commons.wikimedia.org/wiki/File:Fiat_Cronos,_Bariloche.jpg" },
  { file: "/demo/compass.jpg", subject: "Jeep Compass", author: "Kevauto", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2018_Jeep_Compass_Latitude_2.4L_front_4.20.19.jpg" },
  { file: "/demo/renegade.jpg", subject: "Jeep Renegade", author: "RL GNZLZ from Chile", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Jeep_Renegade_1.8_Sport_2018_(43134425314).jpg" },
  { file: "/demo/corolla.jpg", subject: "Toyota Corolla", author: "Ee2mba", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2020_Toyota_Corolla_LE_sedan.jpg" },
  { file: "/demo/hilux.jpg", subject: "Toyota Hilux", author: "RL GNZLZ from Chile", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Toyota_Hilux_SRV_2.8_TD_2023_(54286671377).jpg" },
  { file: "/demo/yaris.jpg", subject: "Toyota Yaris", author: "オーバードライブ83", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2016_Toyota_Yaris_1.5_G_NCP150R_(20190616).jpg" },
  { file: "/demo/corolla-cross.jpg", subject: "Toyota Corolla Cross", author: "Elise240SX", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2022_Toyota_Corolla_Cross_L_FWD,_Front_Left,_11-21-2021.jpg" },
  { file: "/demo/civic.jpg", subject: "Honda Civic", author: "Ghostofakina", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2018_Honda_Civic_(FC)_sedan,_12.1.18.jpg" },
  { file: "/demo/hr-v.jpg", subject: "Honda HR-V", author: "Vauxford", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2019_Honda_HR-V_EX_i-VTEC_1.5_Front.jpg" },
  { file: "/demo/kwid.jpg", subject: "Renault Kwid", author: "NaBUru38", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Renault_Kwid_2017_in_Montevideo_(front).jpg" },
  { file: "/demo/duster.jpg", subject: "Renault Duster (também usada no topo da página inicial)", author: "RL GNZLZ from Chile", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Renault_Duster_2.0_Dynamique_2016_(37006132966).jpg" },
  { file: "/demo/kicks.jpg", subject: "Nissan Kicks", author: "MercurySable99", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:2020_Nissan_Kicks_SR,_front_right.jpg" },
];
