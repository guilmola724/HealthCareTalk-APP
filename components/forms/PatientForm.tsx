"use client";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { createUser } from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export const PatientForm = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // console.log(user);

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  // Set default values when user is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.primaryPhoneNumber?.phoneNumber || "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const newUser = await createUser(values);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      // console.log(error);
    }

    setIsLoading(false);
  };

  if (!user) {
    return <div>Loading...</div>; 
  }

  return (

    <section className="w-full h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 items-center justify-center hidden lg:flex">
        <Image
          src="/assets/images/coming-soon.png"
          width={800}
          height={800}
          alt="doctor"
          className="h-full rounded"
        />
      </div>  
      <div className="lg:w-1/2 flex items-center justify-center">
        <div className="max-w-[400px] w-full">
          <Form {...form} className="mx-auto w-full max-w-lg">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <section className="mb-12 space-y-4 text-center lg:text-left">
                <h1 className="text-2xl lg:text-3xl">Hi there 👋</h1>
                <p className="text-dark-500">Get started with appointments.</p>
              </section>
    
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Full name"
                placeholder="John Doe"
                iconAlt="user"
              />
    
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="johndoe@gmail.com"
                iconAlt="email"
              />
    
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="phone"
                label="Phone number"
                placeholder="(555) 123-4567"
              />
    
              <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
          </Form>
        </div>
      </div>
      
  </section>
  

  );
};
