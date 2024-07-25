"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patients.actions";
import "react-phone-number-input/style.css";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
//importnat hightlights
// const RegisterForm = ({ user }: { user: User }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const form = useForm<z.infer<typeof PatientFormValidation>>({
//     resolver: zodResolver(PatientFormValidation),
//     defaultValues: {
//       ...PatientFormDefaultValues,
//       name: "",
//       email: "",
//       phone: "",
//     },
//   });

//routing is modmentioned  tab switch indexing below for defalt and otheer parameters
const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,  // Make sure this contains all required fields
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
    },
  });
  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);
    let formData;
    
    if(values.identificationDocument && values.identificationDocument.length>0){
      const blobFile=new Blob([values.identificationDocument[0]],{
        type: values.identificationDocument[0].type,
      })
      formData=new FormData();
      formData.append('blobFile',blobFile);
      formData.append('fileName',values.identificationDocument[0].name)
    }
    
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate:new Date(values.birthDate),
        identificationDocument: formData,
      };
      // @ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Anand Prakash"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
          />
          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="Kutelabhata Durg"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="House Maker"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's name"
          />
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="(+91) 123-456-7890"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2 gap-6">
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

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="Govt India Scheme"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="abs123456789"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication (if any)"
            placeholder="Paracetamol 500mg, Cetirizine 10mg"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had diabetes, father had insomnia"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="123456789"
        />
        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to the privacy policy"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Form, FormControl } from "@/components/ui/form";
// import CustomFormField from "../CustomFormField";
// import SubmitButton from "../SubmitButton";
// import { useState } from "react";
// import { UserFormValidation } from "@/lib/validation";
// import { useRouter } from "next/navigation";
// import { createUser } from "@/lib/actions/patients.actions";
// import "react-phone-number-input/style.css";
// import { FormFieldType } from "./PatientForm";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { Doctors, GenderOptions, IdentificationTypes } from "@/constants";
// import { Label } from "../ui/label";
// import { SelectItem } from "../ui/select";
// import Image from "next/image";
// import FileUploader from "../FileUploader";
// const RegisterForm = ({user}: {user: User}) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const form = useForm<z.infer<typeof UserFormValidation>>({
//     resolver: zodResolver(UserFormValidation),
//     defaultValues: {
//       name: "",
//       email: "",
//       phone: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
//     setIsLoading(true);

//     try {
//       const user = {
//         name: values.name,
//         email: values.email,
//         phone: values.phone,
//       };

//       const newUser = await createUser(user);

//       if (newUser) {
//         router.push(`/patients/${newUser.$id}/register`);
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
//         <section className="space-y-4">
//           <h1 className="header">Welcome 👋</h1>
//           <p className="text-dark-700">Let us know more about yourself.</p>
//         </section>

//         <section className="space-y-6">
//             <div className="mb-9 space-y-1">
//                 <h2 className="sub-header">Personal Information</h2>
//             </div>
//         </section>

//         <CustomFormField
//           fieldType={FormFieldType.INPUT}
//           control={form.control}
//           name="name"
//           label="Full Name"
//           placeholder="Anand Prakash"
//           iconSrc="/assets/icons/user.svg"
//           iconAlt="user"
//         />
//         <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="email"
//                 label="Email"
//                 placeholder="anand@gmail.com"
//                 iconSrc="/assets/icons/email.svg"
//                 iconAlt="email"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.PHONE_INPUT}
//                 control={form.control}
//                 name="phone"
//                 label="Phone number"
//                 placeholder="(+91) 123-456-7890"
//                 iconSrc="/assets/icons/user.svg"
//                 iconAlt="user"
//             />
//         </div>
//         <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//                 fieldType={FormFieldType.DATE_PICKER}
//                 control={form.control}
//                 name="birthDate"
//                 label="Date ofBirth"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.SKELETON}
//                 control={form.control}
//                 name="gender"
//                 label="Gender"
//                 renderSkeleton={(field) => (
//                     <FormControl>
//                     <RadioGroup
//                         className="flex h-11 gap-6 xl:justify-between"
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                     >
//                         {GenderOptions.map((option) => (
//                         <div key={option} className="radio-group">
//                             <RadioGroupItem value={option} id={option} />
//                             <Label htmlFor={option} className="cursor-pointer">
//                             {option}
//                             </Label>
//                         </div>
//                         ))}
//                     </RadioGroup>
//                     </FormControl>
//                 )}
//             />

//         </div>
        
//         <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="address"
//                 label="Address"
//                 placeholder="Kutelabhata Durg"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="occupation"
//                 label="Occupation"
//                 placeholder="House Maker"
//             />
//         </div>
//         <div className="flex flex-col gap-6 xl:flex-row">
//           <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="emergencyContactName"
//                 label="Emergency contact name"
//                 placeholder="Guardian's name"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.PHONE_INPUT}
//                 control={form.control}
//                 name="emergencyContactNumber"
//                 label="Emergency contact number"
//                 placeholder="(+91) 123-456-7890"
//                 iconSrc="/assets/icons/user.svg"
//                 iconAlt="user"
//             />
//         </div>

//         <section className="space-y-6">
//             <div className="mb-9 space-y-1">
//                 <h2 className="sub-header">Medical Information</h2>
//             </div>
//         </section>

//         <CustomFormField
//                 fieldType={FormFieldType.SELECT}
//                 control={form.control}
//                 name="primaryPhysician"
//                 label="Primary Physician"
//                 placeholder="Select a physician"
//         >
//           {Doctors.map((doctor)=>(
//             <SelectItem key={doctor.name} value={doctor.name}>
//               <div className="flex cursor-poiner item-center gap-2 gap-6">
//                 <Image
//                   src={doctor.image}
//                   width={32}
//                   height={32}
//                   alt={doctor.name}
//                   className="rounded-full border border-dark-500"
//                 />
//                 <p>{doctor.name}</p>
//               </div>
//             </SelectItem>
//           ))}
//         </CustomFormField>

//         <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="insuranceProvider"
//                 label="Insurance Provider"
//                 placeholder="Govt India Scheme"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="insurancePolicyNumber"
//                 label="Insurance Policy Number"
//                 placeholder="abs123456789"
//             />
//         </div>
//         <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="allergies"
//                 label="Allergues (if any)"
//                 placeholder="Peanuts, Penicilin, Pollen"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="currentMedication"
//                 label="Current medication (if any)"
//                 placeholder="Paracetamol 500mg, Citrizen 10mg"
//             />
//         </div>
//         <div className="flex flex-col gap-6 xl:flex-row">
//             <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="familyMedicalHistory"
//                 label="Family medical history"
//                 placeholder="Mother had diabeties, father had insomia"
//             />
//             <CustomFormField
//                 fieldType={FormFieldType.TEXTAREA}
//                 control={form.control}
//                 name="pastMedialHistory"
//                 label="Past medical histpry"
//                 placeholder="Appendectomy, Tonsillectomy"
//             />
//         </div>
//         <section className="space-y-6">
//             <div className="mb-9 space-y-1">
//                 <h2 className="sub-header">Identification and Verification</h2>
//             </div>
//         </section>
//         <CustomFormField
//                 fieldType={FormFieldType.SELECT}
//                 control={form.control}
//                 name="identificationType"
//                 label="Identification Type"
//                 placeholder="Select an identification type"
//         >
//           {IdentificationTypes.map((type)=>(
//             <SelectItem key={type} value={type}>
//               {type}
//             </SelectItem>
//           ))}
//         </CustomFormField>
//         <CustomFormField
//                 fieldType={FormFieldType.INPUT}
//                 control={form.control}
//                 name="identificationNumber"
//                 label="Identification Number"
//                 placeholder="123456789"
//         />
//         <CustomFormField
//                 fieldType={FormFieldType.SKELETON}
//                 control={form.control}
//                 name="identificationDocument"
//                 label="Scanned copy of identification document"
//                 renderSkeleton={(field) => (
//                     <FormControl>
//                       <FileUploader files={field.value} onChange={field.onChange} />
//                     </FormControl>
//                 )}
//         />
//         <section className="space-y-6">
//             <div className="mb-9 space-y-1">
//                 <h2 className="sub-header">Consent and Privacy</h2>
//             </div>
//         </section>
//         <CustomFormField
//           fieldType={FormFieldType.CHECKBOX}
//           control={form.control}
//           name="treatmentConsent"
//           label="I consent to treatment"
//         />
//         <CustomFormField
//           fieldType={FormFieldType.CHECKBOX}
//           control={form.control}
//           name="disclosureConsent"
//           label="I consent to disclosure of information"
//         />
//         <CustomFormField
//           fieldType={FormFieldType.CHECKBOX}
//           control={form.control}
//           name="privacyConsent"
//           label="I consent to privacy policy"
//         />

//         <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
//       </form>
//     </Form>
//   );
// };

// export default RegisterForm;

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