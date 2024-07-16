"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patients.actions";
import "react-phone-number-input/style.css";

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hey! there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="FULL Name"
          placeholder="Anand Prakash"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="anand@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(+91) 123-456-7890"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;

// "use client";
 
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import {Form} from "@/components/ui/form"
// import CustomFormField from "../CustomFormField"
// import SubmitButton from "../SubmitButton"
// import { useState } from "react"
// import { UserFormValidation } from "@/lib/validation"
// import { useRouter } from "next/navigation"
// import { createUser } from "@/lib/actions/patients.actions"
// import "react-phone-number-input/style.css";

// export enum FormFieldType{
//     INPUT='input',
//     TEXTAREA='textarea',
//     PHONE_INPUT='phoneInput',
//     CHECKBOX='checkbox',
//     DATE_PICKER='datePicker',
//     SELECT='select',
//     SKELETON='skeleton',
// }


// const PatientForm=()=> {
// //   // 1. Define your form.
//   const router = useRouter();
//   const [isLoading, setIsLoading]=useState(false);
//   const form = useForm<z.infer<typeof UserFormValidation>>({
//     resolver: zodResolver(UserFormValidation),
//     defaultValues: {
//       name:"",
//       email: "",
//       phone: "",
//     },
//   });
 
// //   // 2. Define a submit handler.
// //   const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
// //     setIsLoading(true);

// //     try {
// //       const user = {
// //         name: values.name,
// //         email: values.email,
// //         phone: values.phone,
// //       };

// //       const newUser = await createUser(user);

// //       if (newUser) {
// //         router.push(`/patients/${newUser.$id}/register`);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //     }

// //     setIsLoading(false);
// //   };
//   async function onSubmit({ name, email, phone }: z.infer<typeof UserFormValidation>) {
//     // Do something with the form values.
//     // ✅ This will be type-safe and validated.
//     setIsLoading(true);
//     try {
//       const userData = { name, email, phone };
//       const user = await createUser(userData);
//       if (user) router.push(`/patients/${user.$id}/register`)
//     } catch (error) {
//       console.log(error);
//     } //finally {
//     setIsLoading(false);
//     //}
//     //console.log(values)
//   }
  
//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
//                 <section className="mb-12 space-y-4">
//                     <h1 className="header">Hey! there 👋</h1>
//                     <p className="text-dark-700">Schedule your first appointment.</p>
//                 </section>
//                 <CustomFormField 
//                     fieldType={FormFieldType.INPUT}
//                     control={form.control}
//                     name="name"
//                     label="FULL Name"
//                     placeholder="Anand Prakash"
//                     iconSrc="/assets/icons/user.svg"
//                     iconAlt="user"
//                 />
                
//                 <CustomFormField 
//                     fieldType={FormFieldType.INPUT}
//                     control={form.control}
//                     name="email"
//                     label="Email"
//                     placeholder="anand@gmail.com"
//                     iconSrc="/assets/icons/email.svg"
//                     iconAlt="email"
//                 />
//                 <CustomFormField 
//                     fieldType={FormFieldType.PHONE_INPUT}
//                     control={form.control}
//                     name="Phone"
//                     label="Pone number"
//                     placeholder="(+91) 123-456-7890"
//                     iconSrc="/assets/icons/user.svg"
//                     iconAlt="user"
//                 />
//                 <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
//                 </form>
//       </Form>
//     )
// }

// export default PatientForm