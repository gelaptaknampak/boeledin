"use client";

import {
  Zap,
  Settings,
  Grid3x3,
  Lightbulb,
} from "lucide-react";

import { motion, type Variants } from "framer-motion";

type Props = {
  data: any;
};


const iconMap = {
  Zap,
  Settings,
  Grid3X3: Grid3x3,
  Lightbulb,
};



export default function ServicesSection({ data }: Props) {

  console.log("SERVICES SECTION DATA:", data);

  const containerVariants: Variants = {
    hidden: {},

    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };


  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
    },

    visible: {
      opacity: 1,
      y: 0,

      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };



  return (

    <section
      className="
        bg-background
        py-16
        sm:py-20
        lg:py-28
      "
    >

      <div
        className="
          container
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >


        {/* Header */}

        <motion.div
          className="
            mx-auto
            mb-12
            max-w-4xl
            text-center
            lg:mb-20
          "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once:true,
            amount:0.3,
          }}
        >

          <motion.div
            variants={itemVariants}
            className="
              inline-flex
              rounded-full
              bg-accent
              px-4
              py-2
              text-xs
              sm:text-sm
              font-semibold
              uppercase
              tracking-wider
              text-primary
            "
          >
            {data?.eyebrow ?? ""}
          </motion.div>



          <motion.h2
            variants={itemVariants}
            className="
              mt-5
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
              text-foreground
            "
          >
            {data?.title ?? ""}
          </motion.h2>



          <motion.p
            variants={itemVariants}
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-sm
              sm:text-base
              lg:text-lg
              leading-7
              text-muted-foreground
            "
          >
            {data?.description ?? ""}
          </motion.p>


        </motion.div>





        {/* Services Grid */}

        <motion.div
          className="
            grid
            grid-cols-1
            gap-6
            sm:grid-cols-2
            xl:grid-cols-4
          "
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once:true,
            amount:0.2,
          }}
        >


          {(data?.services ?? []).map(
            (service:any,index:number)=>{


            const Icon =
              iconMap[
                service.icon as keyof typeof iconMap
              ] ?? Zap;



            return (

              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y:-10,
                  transition:{
                    duration:0.25,
                  },
                }}
                className="group h-full"
              >


                <div
                  className="
                    relative
                    h-full
                    overflow-hidden
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-6
                    sm:p-7
                    transition-all
                    duration-300
                    hover:border-primary/30
                    hover:shadow-xl
                  "
                >



                  {/* Number */}

                  <span
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      bottom-1
                      text-6xl
                      sm:text-7xl
                      font-black
                      leading-none
                      text-blue-900
                      opacity-20
                      dark:text-sky-300
                    "
                  >
                    {service.number}
                  </span>





                  {/* Icon */}

                  <div
                    className="
                      mb-6
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-primary/15
                      bg-primary/10
                      transition-all
                      duration-300
                      group-hover:scale-110
                    "
                  >

                    <Icon
                      className="
                        h-7
                        w-7
                        text-primary
                      "
                    />

                  </div>





                  {/* Title */}

                  <h3
                    className="
                      mb-3
                      text-xl
                      font-semibold
                      text-foreground
                    "
                  >
                    {service.title}
                  </h3>





                  {/* Description */}

                  <p
                    className="
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    {service.description}
                  </p>


                </div>


              </motion.div>

            );

          })}


        </motion.div>


      </div>

    </section>

  );
}