"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
	Doctors,
	GenderOptions,
	IdentificationTypes,
	PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { registerPatient } from "@/lib/actions/patient.actions";

const PatientForm = ({ user }: { user: User }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormDefaultValues,
			name: "",
			email: "",
			phone: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
		setIsLoading(true);
		let formData;

		if (
			values.identificationDocument &&
			values.identificationDocument.length > 0
		) {
			const blobFile = new Blob([values.identificationDocument[0]], {
				type: values.identificationDocument[0].type,
			});

			formData = new FormData();
			formData.append("blobFile", blobFile);
			formData.append("fileName", values.identificationDocument[0].name);
		}

		try {
			const patientData = {
				...values,
				userId: user.$id,
				birthDate: new Date(values.birthDate),
				IdentificationDocument: formData,
			};

			// @ts-ignore
			const patient = await registerPatient(patientData);

			if (patient) router.push(`/patients/${user.$id}/new-appointment`);
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-12 flex-1'
			>
				<section className='space-y-4 '>
					<h1 className='header text-white'>Welcome👋</h1>
					<p className='text-dark-700'>Let us know more about yourself</p>
				</section>
				<section className='space-y-6 '>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header text-white'>Personal Information</h2>
					</div>
				</section>
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name='name'
					label='Full name'
					placeholder='John Doe'
					iconSrc='/assets/icons/user.svg'
					iconAlt='user'
				/>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.INPUT}
							name='email'
							label='Email'
							placeholder='johndoe@gmail.com'
							iconSrc='/assets/icons/email.svg'
							iconAlt='email'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.PHONE_INPUT}
							name='phone'
							label='Phone number'
							placeholder='8900000000'
						/>
					</div>
				</div>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.DATE_PICKER}
							name='birthDate'
							label='Date of Birth'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.SKELETON}
							name='gender'
							label='Gender'
							renderSkeleton={(field) => (
								<FormControl>
									<RadioGroup
										className='flex h-11 gap-6 xl:justify-between'
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										{GenderOptions.map((option) => (
											<div
												key={option}
												className='radio-group'
											>
												<RadioGroupItem
													value={option}
													id={option}
													className='text-white'
												/>
												<Label
													htmlFor={option}
													className='cursor-pointer text-white'
												>
													{option}
												</Label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
							)}
						/>
					</div>
				</div>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.INPUT}
							name='address'
							label='Address'
							placeholder='10th street, town'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.INPUT}
							name='occupation'
							label='Occupation'
							placeholder='Software Engineer'
						/>
					</div>
				</div>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.INPUT}
							name='emergencyContactName'
							label='Emergency Contact Name'
							placeholder='Guardians name'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.PHONE_INPUT}
							name='emergencyContactNumber'
							label='Emergency Contact Number'
							placeholder='8900000000'
						/>
					</div>
				</div>
				<section className='space-y-6 '>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header text-white'>Medical Information</h2>
					</div>
				</section>
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.SELECT}
					name='primaryPhysician'
					label='Primary Physician'
					placeholder='Select a physician'
				>
					{Doctors.map((doctor) => (
						<SelectItem
							key={doctor.name}
							value={doctor.name}
						>
							<div className='flex cursor-pointer items-center gap-2'>
								<Image
									src={doctor.image}
									width={32}
									height={32}
									alt={doctor.name}
									className={"rounded-full border border-dark-500"}
								/>
								<p className='text-white'>{doctor.name}</p>
							</div>
						</SelectItem>
					))}
				</CustomFormField>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.INPUT}
							name='insuranceProvider'
							label='Insurance Provider'
							placeholder='LIC'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.INPUT}
							name='insurancePolicyNumber'
							label='Insurance Policy Number'
							placeholder='ABC 1234 56789'
						/>
					</div>
				</div>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.TEXTAREA}
							name='allergies'
							label='Allergies (if any)'
							placeholder='Peanuts, Pollen'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.TEXTAREA}
							name='currentMedication'
							label='Current Medication (if any)'
							placeholder='Paracetamol 500mg'
						/>
					</div>
				</div>
				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.TEXTAREA}
							name='familyMedicalHistory'
							label='Family Medical History'
							placeholder='Father had heart disease'
						/>
					</div>
					<div className='flex-1'>
						<CustomFormField
							control={form.control}
							fieldType={FormFieldType.TEXTAREA}
							name='pastMedicalHistory'
							label='Past Medical History'
							placeholder='Appendectomy'
						/>
					</div>
				</div>
				<section className='space-y-6 '>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header text-white'>
							Identification and Verification
						</h2>
					</div>
				</section>
				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.SELECT}
					name='identificationType'
					label='Identification type'
					placeholder='Select an identification type'
				>
					{IdentificationTypes.map((type) => (
						<SelectItem
							key={type}
							value={type}
						>
							{type}
						</SelectItem>
					))}
				</CustomFormField>

				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.INPUT}
					name='identificationNumber'
					label='Identification Number'
					placeholder='1234567890'
				/>

				<CustomFormField
					control={form.control}
					fieldType={FormFieldType.SKELETON}
					name='identificationDocument'
					label='Scanned copy of Identification Document'
					renderSkeleton={(field) => (
						<FormControl>
							<FileUploader
								files={field.value}
								onChange={field.onChange}
							/>
						</FormControl>
					)}
				/>

				<section className='space-y-6 '>
					<div className='mb-9 space-y-1'>
						<h2 className='sub-header text-white'>Concent and Privacy</h2>
					</div>
				</section>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='treatmentConsent'
					label='I consent to treatment for my health condition.'
				/>

				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='disclosureConsent'
					label='I consent to disclosure of my health information for treatment purposes.'
				/>
				<CustomFormField
					fieldType={FormFieldType.CHECKBOX}
					control={form.control}
					name='privacyConsent'
					label='I acknowledge that I have reviewed and agreed to the privacy policy.'
				/>

				<SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
			</form>
		</Form>
	);
};

export default PatientForm;
