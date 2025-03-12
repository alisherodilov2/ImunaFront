import * as yup from "yup";

// Define the interface for the form values
interface FormValues {
    status: string;
    field_name: string;
}

// Create a Yup schema
const defaultValues = yup.object<any>().shape({
    pay_type: yup.string().required("Tolov turini tanlang!"),
    // pay_total_price: yup
    //     .number()
    //     .typeError('Tolovni kirtishda xatolik bor') // Faqat raqam qabul qilish
    //     .positive('Tolovni kirtishda xatolik bor') // 0 dan katta bo'lishi kerak
    // // .required('Tolovni kirting'), // Majburiy maydon,
    pay_total_price: yup
        .number()
        .typeError('Narx raqam bo\'lishi kerak') // Faqat raqam qabul qilish
        .required('Price is required'), // Majburiy maydon,

})
const discoutValidate = yup.object<any>().shape({
    pay_type: yup.string().required("Tolov turini tanlang!"),
    discount_comment: yup.string().required("Tolov turini tanlang!"),
    pay_total_price: yup
        .number()
        .typeError('Price must be a number') // Faqat raqam qabul qilish

        .required('Price is required'), // Majburiy maydon,
    discount: yup
        .number()
        .typeError('Price must be a number') // Faqat raqam qabul qilish
        .positive('Price must be greater than 0') // 0 dan katta bo'lishi kerak
        .required('Price is required'), // Majburiy maydon,

})
const debtValidate = yup.object<any>().shape({
    pay_type: yup.string().required("Tolov turini tanlang!"),
    debt_comment: yup.string().required("Tolov turini tanlang!"),
    debt_price: yup
        .number()
        .typeError('Price must be a number') // Faqat raqam qabul qilish
        .positive('Price must be greater than 0') // 0 dan katta bo'lishi kerak
        .required('Price is required'), // Majburiy maydon,
    pay_total_price: yup
        .number()
        .required('Price is required'), // Majburiy maydon,
    payment_deadline: yup.string().required("Tolov muddatni tanlang!"),

})
const debtAndDiscountValidate = yup.object<any>().shape({
    
    payment_deadline: yup.string().required("Tolov muddatni tanlang!"),
    pay_type: yup.string().required("Tolov turini tanlang!"),
    debt_comment: yup.string().required("Tolov turini tanlang!"),
    debt_price: yup
        .number()
        .typeError('Price must be a number') // Faqat raqam qabul qilish
        .positive('Price must be greater than 0') // 0 dan katta bo'lishi kerak
        .required('Price is required'), // Majburiy maydon,
    discount_comment: yup.string().required("Tolov turini tanlang!"),
    pay_total_price: yup
        .number()
        .required('Price is required'), // Majburiy maydon,
    discount: yup
        .number()
        .typeError('Price must be a number') // Faqat raqam qabul qilish
        .positive('Price must be greater than 0') // 0 dan katta bo'lishi kerak
        .required('Price is required'), // Majburiy maydon,
})

export const cashRegisterValidateCheck = ({
    role = '',
    edit = false
}: { role?: string, edit?: boolean }) => {
    if (role == 'debt') return debtValidate
    if (role == 'discount') return discoutValidate
    if (role == 'debt_and_discount') return debtAndDiscountValidate
    return defaultValues
}