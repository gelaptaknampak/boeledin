import { getPostById } from "@/lib/wordpress";
import type { LangCode } from "@/lib/wordpress";

import SectionForm from "@/components/admin/sections/SectionForm";
import { contactSectionConfig } from "@/components/admin/sections/sectionConfig";


function setValue(obj:any,path:string,value:any){

  const keys = path.split(".");

  let current=obj;


  keys.forEach((key,index)=>{

    const last=index===keys.length-1;
    const next=keys[index+1];


    if(last){
      current[key]=value;
      return;
    }


    if(!(key in current)){
      current[key]= /^\d+$/.test(next)
        ? []
        : {};
    }


    current=current[key];

  });

}



export default async function ContactFormPage({
 searchParams,
}:{
 searchParams: Promise<{
  lang?:string|string[]
 }>;
}){


 const config = contactSectionConfig.form;


 const params = await searchParams;


 const rawLang = Array.isArray(params.lang)
 ? params.lang[0]
 : params.lang;



 const lang:LangCode =
 rawLang==="en"
 ? "en"
 : "id";



 const postId=config.id[lang];


 if(!postId){
  throw new Error(
   `Contact Form bahasa ${lang} belum dikonfigurasi`
  );
 }



 const post = await getPostById(
  postId,
  lang
 );


 if(!post){
  throw new Error(
   "Contact Form tidak ditemukan"
  );
 }



 const acf = post.acf ?? {};

 const data:any={};



 config.fields.forEach((field)=>{


   let value = acf[field.acf];


   if(field.type==="true_false"){
     value =
       value === true ||
       value === 1 ||
       value === "1";
   }



   setValue(
    data,
    field.name,
    value ?? ""
   );


 });



 return (
  <SectionForm
    data={data}
    config={{
      ...config,
      id:postId,
    }}
  />
 );

}