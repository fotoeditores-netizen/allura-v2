import { groq } from "next-sanity";

export const globalConfigQuery = groq`
  *[_type == "globalConfig"][0] {
    whatsappUrl,
    email,
    instagram,
    facebook,
    linkedin,
    tiktok,
    copyright_es,
    copyright_en
  }
`;

export interface GlobalConfig {
  whatsappUrl: string;
  email: string;
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  tiktok?: string;
  copyright_es?: string;
  copyright_en?: string;
}
