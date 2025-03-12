import * as yup from "yup";

// Define the interface for the form values
interface FormValues {
    status: string;
    field_name: string;
}

// Create a Yup schema
const defaultValues = yup.object<any>().shape({
    role: yup.string().required("Xodimning mustaxasisligi kiriting!"),
    full_name: yup.string().required("Familiyasi kiriting!"),
    password: yup.string().required("Ismi kiriting!"),
    con_password: yup.string().required("Parol kiritng kiriting!").oneOf([yup.ref('password')], "Parol mos kelmadi!"),
    name: yup.string().required("Nomini kiriting!"),
    user_phone: yup.string().required("Telefon kiriting!")
        .test(
            'valid-length',
            'Phone number must have exactly 9 digits after the country code',
            (val: any) => {
                const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
            }
        )
})

const defaultValuesEdit = yup.object<any>().shape({
    role: yup.string().required("Xodimning mustaxasisligi kiriting!"),
    full_name: yup.string().required("Familiyasi kiriting!"),
    password: yup.string(),
    con_password: yup.string().oneOf([yup.ref('password')], "Parol mos kelmadi!"),
    name: yup.string().required("Nomini kiriting!"),
    user_phone: yup.string().required("Telefon kiriting!")
        .test(
            'valid-length',
            'Phone number must have exactly 9 digits after the country code',
            (val: any) => {
                const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
            }
        )
})

const doctorAndLabaratoryValidate = yup.object<any>().shape({
    role: yup.string().required("Xodimning mustaxasisligi kiriting!"),
    full_name: yup.string().required("Familiyasi kiriting!"),
    inpatient_share_price: yup.string().required("Statsionar ulushi kiriting!"),
    department_id: yup.string().required("Shifokorning ixtisosligi kiriting!"),
    password: yup.string().required("Ismi kiriting!"),
    con_password: yup.string().required("Parol kiritng kiriting!").oneOf([yup.ref('password')], "Parol mos kelmadi!"),
    name: yup.string().required("Nomini kiriting!"),
    user_phone: yup.string().required("Telefon kiriting!")
        .test(
            'valid-length',
            'Phone number must have exactly 9 digits after the country code',
            (val: any) => {
                const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
            }
        )
})
const doctorAndLabaratoryValidateEdit = yup.object<any>().shape({
    role: yup.string().required("Xodimning mustaxasisligi kiriting!"),
    full_name: yup.string().required("Familiyasi kiriting!"),
    inpatient_share_price: yup.string().required("Statsionar ulushi kiriting!"),
    department_id: yup.string().required("Shifokorning ixtisosligi kiriting!"),
    password: yup.string(),
    con_password: yup.string().oneOf([yup.ref('password')], "Parol mos kelmadi!"),
    name: yup.string().required("Nomini kiriting!"),
    user_phone: yup.string().required("Telefon kiriting!")
        .test(
            'valid-length',
            'Phone number must have exactly 9 digits after the country code',
            (val: any) => {
                const phoneNumber = val && val.replace(/[^\d]/g, ''); // Remove non-numeric characters
                return phoneNumber && phoneNumber.length === 9; // Check if digits after '998' are exactly 9
            }
        )
})
export const validateCheck = ({
    role = '',
    edit = false
}: { role?: string, edit?: boolean }) => {
    if ((role === 'doctor' || role === 'labaratory') && !edit) {
        return doctorAndLabaratoryValidate
    }
    if ((role === 'doctor' || role === 'labaratory') && edit) {
        return doctorAndLabaratoryValidateEdit
    }
    if (edit) {
        return defaultValuesEdit
    }
    return defaultValues
}