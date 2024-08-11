"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { AppointmentFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patients.actions";
import "react-phone-number-input/style.css";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";


const AppointmentForm = ({
    userId,patientId,type
}:{
    userId: string;
    patientId: string;
    type: "create" | "cancel"|"schedule";
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note:"",
      cancellationReason:"",
    },
  });

  const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch(type){
        case 'schedule':
            status = 'scheduled';
            break;
        case 'cancel':
            status='cancelled';
            break;
        default:
            status='pending';
            break;
    }
    try {
      if(type ==='create' && patientId){
        const appointmentData=
        {
            userId,
            patient:patientId,
            primaryPhysician: values.primaryPhsician,
            schedule: new Date(values.schedule),
            reason: values.reason,
            note: values.note,
            status: status as Status,
        }       
      }
      //const appointment=await createAppointment(appointmentData);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  let buttonLabel;
  switch(type){
    case 'cancel':
        buttonLabel='Cancel Appointment';
        break;
    case 'create':
        buttonLabel='Create Appointment';
        break;
    case 'schedule':
        buttonLabel='Schedule Appointment';
        break;
    default:
        break;
  }
  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
            <section className="mb-12 space-y-4">
            <h1 className="header">New Appointment</h1>
            <p className="text-dark-700">Request a new appointment in just 10 seconds</p>
            </section>

            {type !== "cancel" && (
            <>
                <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="primaryPhysician"
                label="Doctor"
                placeholder="Select a doctor"
                >
                {Doctors.map((doctor) => (
                    <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-6">
                        <Image
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                        />
                        <p>{doctor.name}</p>
                    </div>
                    </SelectItem>
                ))}
                </CustomFormField>

                <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="Schedule"
                label="Expected Appointment Date"
                showTimeSelect
                dateFormat="MM/dd/yyyy - h:mm aa"
                />

                <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="reason"
                    label="Reason for Appointment"
                    placeholder="Enter the reason for your appointment"
                />
                <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    control={form.control}
                    name="note"
                    label="Notes"
                    placeholder="Enter any notes"
                />
                </div>
            </>
            )}

            {type === "cancel" && (
            <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="cancellationReason"
                label="Reason for Cancellation"
                placeholder="Enter the reason for cancellation"
            />
            )}

            <SubmitButton
            isLoading={isLoading}
            className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
            >
            {buttonLabel}
            </SubmitButton>
        </form>
        </Form>

    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
    //     <section className="mb-12 space-y-4">
    //       <h1 className="header">New Appointment</h1>
    //       <p className="text-dark-700">Request a new appointment in 10 seconds</p>
    //     </section>
    //     {type !=="cancel" && (
    //         <>
    //             <CustomFormField
    //                 fieldType={FormFieldType.SELECT}
    //                 control={form.control}
    //                 name="primaryPhysician"
    //                 label="Doctor"
    //                 placeholder="Select a doctor"
    //                 >
    //                 {Doctors.map((doctor) => (
    //                     <SelectItem key={doctor.name} value={doctor.name}>
    //                     <div className="flex cursor-pointer items-center gap-2 gap-6">
    //                         <Image
    //                         src={doctor.image}
    //                         width={32}
    //                         height={32}
    //                         alt={doctor.name}
    //                         className="rounded-full border border-dark-500"
    //                         />
    //                         <p>{doctor.name}</p>
    //                     </div>
    //                     </SelectItem>
    //                 ))}
    //             </CustomFormField>
    //             <CustomFormField
    //                 fieldType={FormFieldType.DATE_PICKER}
    //                 control={form.control}
    //                 name="Schedule"
    //                 label="Expected appointment Date"
    //                 showTimeSelect
    //                 dateFormat="MM/dd/yyyy - h:mm aa"
    //             >
    //             <div className="flex flex-col gap-6">
    //             <CustomFormField
    //                 fieldType={FormFieldType.TEXTAREA}
    //                 control={form.control}
    //                 name="reasone"
    //                 label="Reason for appointment"
    //                 placeholder="Enter reason for your appointment"
    //             />
    //             <CustomFormField
    //                 fieldType={FormFieldType.TEXTAREA}
    //                 control={form.control}
    //                 name="note"
    //                 label="Notes"
    //                 placeholder="Enter notes"
    //             />
    //         </div>
    //     </>
    //     )}
    //     {type === "cancel" &&(
    //         <CustomFormField
    //         fieldType={FormFieldType.TEXTAREA}
    //         control={form.control}
    //         name="cancellationReason"
    //         label="Reason for cancellation"
    //         placeholder="Enter reason for cancellation"
    //         />
    //     )}
    //     <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>Get Started</SubmitButton>
    //   </form>
    // </Form>
  )
}

export default AppointmentForm;

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