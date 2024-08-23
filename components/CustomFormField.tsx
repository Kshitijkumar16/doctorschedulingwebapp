"use client";
import React from "react";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

interface CustomProps {
	control: Control<any>;
	fieldType: FormFieldType;
	name: string;
	label?: string;
	placeholder?: string;
	iconSrc?: string;
	iconAlt?: string;
	disabled?: boolean;
	dateFormat?: string;
	showTimeSelect?: boolean;
	children?: React.ReactNode;
	renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
	const { fieldType, placeholder, iconSrc, iconAlt } = props;
	switch (fieldType) {
		case FormFieldType.INPUT:
			return (
				<div className='flex rounded-md border border-dark-500 bg-dark-400'>
					{iconSrc && (
						<Image
							src={iconSrc}
							alt={iconAlt || "icon"}
							height={24}
							width={24}
							className='ml-2'
						/>
					)}
					<FormControl>
						<Input
							placeholder={placeholder}
							{...field}
							className='shad-input border-0'
						/>
					</FormControl>
				</div>
			);
		case FormFieldType.PHONE_INPUT:
			return (
				<PhoneInput
					defaultCountry='IN'
					placeholder={placeholder}
					international
					withCountryCallingCode
					value={field.value}
					onChange={field.onChange}
					className=' input-phone bg-inherit text-white'
				/>
			);
		case FormFieldType.CHECKBOX:
			return <div></div>;
		default:
			break;
	}
};

const CustomFormField = (props: CustomProps) => {
	const { control, fieldType, name, label } = props;
	return (
		<div>
			<FormField
				control={control}
				name={name}
				render={({ field }) => (
					<FormItem className='flex-1'>
						{fieldType !== FormFieldType.CHECKBOX && label && (
							<FormLabel className='text-white'>{label}</FormLabel>
						)}
						<RenderField
							field={field}
							props={props}
						/>
						<FormMessage className='shad-error' />
					</FormItem>
				)}
			/>
		</div>
	);
};

export default CustomFormField;
