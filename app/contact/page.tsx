import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import { contactSectionConfig } from "@/components/admin/sections/sectionConfig";


export const metadata = {
  title: "Hubungi Kami — BOELEDIN",
  description:
    "Hubungi PT Future Boeled Indonesia untuk konsultasi digital signage, interactive flat panel, dan LED display.",
};



function mapSectionData(config:any, acf:any){

  const data:any={};


  config.fields.forEach((field:any)=>{

    let value = acf?.[field.acf];


    // Handle link ACF
    if(
      field.type==="link" &&
      value &&
      typeof value==="object"
    ){
      value=value.url;
    }


    // Handle image ACF ID
    if(field.type==="image"){

      if(
        value &&
        typeof value==="object"
      ){
        value =
          value.id ??
          value.url ??
          "";
      }

    }


    data[field.acf]=value ?? "";

  });


  return data;

}



export default async function ContactPage({
  searchParams,
}:{
  searchParams:Promise<{
    lang?:string|string[]
  }>;
}){


  const params = await searchParams;


  const rawLang =
    Array.isArray(params.lang)
      ? params.lang[0]
      : params.lang;



  const lang:LangCode =
    rawLang==="en"
      ? "en"
      : "id";



  const [
    hero,
    form,
    info
  ] = await Promise.all([


    getPostById(
      contactSectionConfig.hero.id[lang],
      lang
    ),


    getPostById(
      contactSectionConfig.form.id[lang],
      lang
    ),


    getPostById(
      contactSectionConfig.info.id[lang],
      lang
    ),


  ]);



  const heroData =
    mapSectionData(
      contactSectionConfig.hero,
      hero?.acf ?? {}
    );


  const formData =
    mapSectionData(
      contactSectionConfig.form,
      form?.acf ?? {}
    );


  const infoData =
    mapSectionData(
      contactSectionConfig.info,
      info?.acf ?? {}
    );



  return (
    <>

      <Navigation />


      <main>

        <ContactHero
          acf={heroData}
        />


        <section className="py-12 md:py-20">

          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">


              <ContactForm
                acf={formData}
              />


              <ContactInfo
                acf={infoData}
              />


            </div>

          </div>

        </section>


      </main>


      <Footer
        lang={
          params.lang === "en"
            ? "en"
            : "id"
        }
      />

    </>
  );

}